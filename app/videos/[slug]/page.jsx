import BackButton from '@/app/components/BackButton';
import NewsLayout from '@/app/components/NewsLayout';
import VideoCarousel from '@/app/components/VideoCarousel';
import { fetchCategoryDataBySlug } from '@/app/lib/FetchData';
import React from 'react';

const page = async ({ params }) => {
  const { slug } = await params;

  const data = await fetchCategoryDataBySlug(slug);
  // console.log(data);

  if (!data) return redirect('/');

  const firstPlaylist = data?.playlists[0] || [];
  const topStories = firstPlaylist?.videos || [];

  const topStoriesTitle = firstPlaylist.playlistName;
  const topStoriesSlug = firstPlaylist.slug;
  const topStoriesId = firstPlaylist.id;
  // return;
  return (
    <>
      <BackButton slug={slug} />
      <NewsLayout
        data={topStories}
        title={topStoriesTitle}
        slug={topStoriesSlug}
        id={topStoriesId}
      />

      {data?.playlists?.slice(1).map((item, index) => (
        <VideoCarousel
          key={index}
          title={item.playlistName}
          slug={item.slug}
          data={item.videos}
          id={item.id}
        />
      ))}
    </>
  );
};

export default page;
