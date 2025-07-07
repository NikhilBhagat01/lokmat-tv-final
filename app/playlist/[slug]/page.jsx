export const dynamic = 'force-static';
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import BackButton from '@/app/components/BackButton';
import NewsLayout from '@/app/components/NewsLayout';
import VideoCarousel from '@/app/components/VideoCarousel';
import { GLOBAL_CONFIG } from '@/app/config/config';
import { getBreadcrumbListJsonld, JsonLdWebPage, PlaylistJsonLd } from '@/app/jsonld';
import { fetchPlaylistDataBySlug } from '@/app/lib/FetchData';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async ({ params }) => {
  const { slug } = await params;
  // console.log(slug);

  const playlistData = await fetchPlaylistDataBySlug(slug);

  // console.log(playlistData);
  if (!playlistData) return redirect('/');

  // console.log(playlistData);

  const breadcrumbJsonld = getBreadcrumbListJsonld([
    { name: 'Videos', url: 'https://www.lokmat.com/videos/' },
    {
      name: playlistData?.playlistName,
      url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/`,
    },
  ]);

  const HubpageJsonLd = PlaylistJsonLd({
    slug: playlistData?.slug,
    name: playlistData?.playlistName,
    ...playlistData,
  });

  const firstPlaylist = playlistData?.playlist[0] || [];
  const topStories = firstPlaylist?.videos || [];

  const topStoriesTitle = firstPlaylist.playlistName;
  const topStoriesSlug = firstPlaylist.slug;
  const topStoriesId = firstPlaylist.id;

  return (
    <>
      <JsonLdWebPage
        url={`${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/`}
        name={playlistData?.playlistName}
        description={playlistData?.playlistName}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonld) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(HubpageJsonLd),
        }}
      />
      <BackButton slug={slug} />
      <NewsLayout
        data={topStories}
        title={topStoriesTitle}
        slug={topStoriesSlug}
        id={topStoriesId}
      />

      {playlistData?.playlist.slice(1).map((item, index) => (
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
