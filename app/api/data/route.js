import { detectAndTranslate } from '@/app/lib/translate';

export async function POST(request) {
  try {
    const { videoId, page } = await request.json();

    if (!videoId || isNaN(page)) {
      return Response.json({ error: 'Missing or invalid parameters' }, { status: 400 });
    }

    const url = `https://api.dailymotion.com/playlist/${videoId}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=12&page=${page}`;

    const res = await fetch(url, {
      next: {
        revalidate: 180,
      },
    });

    if (!res.ok) {
      return Response.json(
        { error: 'Failed to fetch data from Dailymotion' },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!data || !data.list || !Array.isArray(data.list)) {
      return Response.json({ error: 'No data found' }, { status: 404 });
    }

    const listWithSlug = await Promise.all(
      data.list.map(async (item) => {
        const slug = await detectAndTranslate(item);
        return {
          ...item,
          slug,
        };
      })
    );

    return Response.json({
      message: 'Data fetched successfully',
      data: listWithSlug,
      has_more: data?.has_more,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
