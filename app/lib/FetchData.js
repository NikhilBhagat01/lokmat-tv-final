import { redirect } from 'next/navigation';
import { API_URL_DATA, CATEGORY_DATA } from './apilist';
import { slugify } from './utility';
import { promises as fs } from 'fs';
import path from 'path';
import { detectAndTranslate } from './translate';
import { db } from './db';

const VIDEO_FIELDS =
  'id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair';

async function fetchAllDailymotionData() {
  try {
    // const fetches = API_URL_DATA.slice(0, 3).map(async item => {
    const fetches = API_URL_DATA.map(async (item) => {
      const isPlaylist = item.isPlaylist;
      const isFeaturedChannel = item.title_slug === 'featured-channels';
      const title = item.title;
      const id = item.playlist_id;

      let url = isPlaylist
        ? `https://api.dailymotion.com/playlists/?fields=name,id,thumbnail_240_url,videos_total&ids=${item.playlist_id}`
        : `https://api.dailymotion.com/playlist/${item.playlist_id}/videos?fields=${VIDEO_FIELDS}&limit=7&page=1`;

      if (isFeaturedChannel) {
        url =
          'https://api.dailymotion.com/users?fields=id,cover_250_url,avatar_60_url,url,screenname&parent=lokmatonline&sort=recent&limit=7';
      }

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36',
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const listData = data?.list
          ? await Promise.all(
              data.list.map(async (video) => {
                const slug = await detectAndTranslate(video);
                return {
                  ...video,
                  slug,
                };
              })
            )
          : [];

        return {
          title,
          title_slug: item.title_slug,
          isPlaylist,
          isFeaturedChannel,
          data: listData,
          id,
        };
      } catch (err) {
        console.error(`Error fetching ${title}:`, err);
        return {
          title,
          title_slug: item.title_slug,
          isPlaylist,
          isFeaturedChannel,
          data: null,
          id,
        };
      }
    });

    return Promise.all(fetches);
  } catch (error) {
    console.error('Error in fetchAllDailymotionData:', error);
    throw error;
  }
}

async function fetchCategoryDataBySlug(slug) {
  try {
    // const category = CATEGORY_DATA.find((item) => item.slug === slug);

    const filePath = path.join(process.cwd(), 'app', 'lib', 'slug_map.json');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContents);

    const category = jsonData.find((item) => item.slug === slug);

    if (!category) {
      return redirect('/');
    }

    const id = category?.id || null;

    const nameUrl = `https://api.dailymotion.com/playlist/${id}/?fields=name`;
    const playlist_url = `https://api.dailymotion.com/playlist/${id}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=12&page=1`;

    const [nameResponse, playlistResponse] = await Promise.all([
      fetch(nameUrl, {
        next: { revalidate: 300 },
      }),
      fetch(playlist_url, {
        next: { revalidate: 300 },
      }),
    ]);

    if (!nameResponse.ok || !playlistResponse.ok) {
      return redirect('/');
    }

    const [nameData, playlistData] = await Promise.all([
      nameResponse.json(),
      playlistResponse.json(),
    ]);

    const { list, ...rest } = playlistData;

    const playlistDataWithSlugs = await Promise.all(
      list.map(async (video) => {
        const slug = await detectAndTranslate(video);
        return {
          ...video,
          slug,
        };
      })
    );

    return {
      slug: category?.slug,
      categoryName: category?.name,
      playlistData: playlistDataWithSlugs || [],
      id,
    };
    //TODO: handle case where category is not found
    // return category || null;

    // if (!category) {
    //   console.error(`No category found for slug: ${slug}`);
    //   return redirect('/');
    // }
  } catch (error) {
    console.error('Error in fetchCategoryDataBySlug:', error);
    throw error;
  }
}

async function fetchPlaylistDataBySlug(playlistSlug) {
  try {
    let playlistIds = [];
    let playListSlug = '';
    let playListTitle = '';

    const apiData = API_URL_DATA.find((item) => item.title_slug === playlistSlug);
    if (apiData?.playlist_id) {
      playlistIds = apiData.playlist_id;
      playlistSlug = apiData.title_slug;
      playListTitle = apiData.title;
    } else {
      const categoryData = CATEGORY_DATA.find((item) => item.slug === playlistSlug);
      if (categoryData?.playlist) {
        playlistIds = categoryData.playlist;
        playListSlug = categoryData.slug;
        playListTitle = categoryData.name;
      }
    }

    if (!playlistIds) return null;

    const ids = playlistIds.split(',');

    const playlistFetches = ids.map(async (playlistId) => {
      const nameUrl = `https://api.dailymotion.com/playlist/${playlistId}/?fields=name`;
      const videosUrl = `https://api.dailymotion.com/playlist/${playlistId}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=7&page=1`;

      try {
        const [nameResponse, videosResponse] = await Promise.all([
          fetch(nameUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36' },
            next: { revalidate: 300 },
          }),
          fetch(videosUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36' },
            next: { revalidate: 300 },
          }),
        ]);

        if (!nameResponse.ok || !videosResponse.ok) {
          throw new Error('Failed to fetch playlist data');
        }

        const [nameData, videosData] = await Promise.all([
          nameResponse.json(),
          videosResponse.json(),
        ]);

        const { list, ...rest } = videosData;
        const videosWithSlugs = await Promise.all(
          list.map(async (video) => {
            const slug = await detectAndTranslate(video);
            return {
              ...video,
              slug,
            };
          })
        );

        const playlist_slug = nameData.name.replace(/\s+/g, '-').toLowerCase();

        return {
          playlistName: nameData.name,
          videos: videosWithSlugs || [],
          slug: slugify(playlist_slug),
          id: playlistId,
        };
      } catch (err) {
        console.error(`Error fetching playlist ${playlistId}:`, err);
        return null;
      }
    });

    const results = await Promise.all(playlistFetches);

    return {
      // playlistName: API_URL_DATA.find((item) => item.title_slug === playlistSlug)?.title,
      playlistName: playListTitle,
      slug: playlistSlug,
      playlist: results.filter(Boolean),
    };
  } catch (error) {
    console.error('Error in fetchCategoryDataBySlug:', error);
    throw error;
  }
}

async function fetchPlaylistDataById(slug) {
  try {
    const filePath = path.join(process.cwd(), 'app', 'lib', 'slug_map.json');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContents);

    const category = jsonData.find((item) => item.slug === slug);
    const playlistId = category?.id;

    const nameUrl = `https://api.dailymotion.com/playlist/${playlistId}/?fields=name`;
    const videosUrl = `https://api.dailymotion.com/playlist/${playlistId}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=7&page=1`;

    const [nameResponse, videosResponse] = await Promise.all([
      fetch(nameUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36' },
        next: { revalidate: 300 },
      }),
      fetch(videosUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36' },
        next: { revalidate: 300 },
      }),
    ]);
    if (!nameResponse.ok || !videosResponse.ok) {
      throw new Error('Failed to fetch playlist data');
    }
    const [nameData, videosData] = await Promise.all([nameResponse.json(), videosResponse.json()]);

    const { list, ...rest } = videosData;
    const videosWithSlugs = await Promise.all(
      list.map(async (video) => {
        const slug = await detectAndTranslate(video);
        return {
          ...video,
          slug,
        };
      })
    );

    const playlist_slug = nameData.name.replace(/\s+/g, '-').toLowerCase();

    return {
      playlistName: nameData.name,
      videos: videosWithSlugs || [],
      slug: playlist_slug,
      id: playlistId,
    };
  } catch (error) {
    console.error('Error in fetchPlaylistDataById:', error);
    throw error;
  }
}

async function fetchVideoById(videoId) {
  try {
    const url = `https://api.dailymotion.com/video/${videoId}?fields=id,title,thumbnail_480_url,mode,onair,owner.screenname,created_time,start_time,description,thumbnail_240_url,url,channel,owner.url,tags,duration,views_total`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    return null;
  }
}

async function fetchRelatedVideos(videoId, page = 1) {
  try {
    const url = `https://api.dailymotion.com/playlist/${videoId}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=12&page=${page}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const { list, ...rest } = data;

    const listWithSlugs = await Promise.all(
      list.map(async (video) => {
        const slug = await detectAndTranslate(video);
        return {
          ...video,
          slug,
        };
      })
    );

    return { ...rest, list: listWithSlugs };
  } catch (error) {
    console.error('Error fetching related videos:', error);
    return { list: [], has_more: false };
  }
}

async function getVideoBySlug(slug) {
  try {
    const [rows] = await db.execute('SELECT * FROM dm_videos WHERE slug = ? LIMIT 1', [slug]);

    const videoId = rows.length > 0 ? rows[0].video_id : null;
    if (!videoId) {
      return redirect('/');
    }

    const videoData = await fetchVideoById(videoId);
    if (!videoData) {
      // return redirect('/');
    }

    return videoData;
  } catch (err) {
    console.error('Error fetching video by slug:', err);
    throw err;
  }
}

export {
  fetchAllDailymotionData,
  fetchCategoryDataBySlug,
  fetchPlaylistDataBySlug,
  fetchVideoById,
  fetchRelatedVideos,
  fetchPlaylistDataById,
  getVideoBySlug,
};
