export const dynamic = 'force-static';
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import BackButton from '@/app/components/BackButton';
import NewsLayout from '@/app/components/NewsLayout';
import VideoCarousel from '@/app/components/VideoCarousel';
import { GLOBAL_CONFIG } from '@/app/config/config';
import { getBreadcrumbListJsonld, JsonLdWebPage, PlaylistJsonLd } from '@/app/jsonld';
import { getChannnelDataBySlug } from '@/app/lib/FetchData';
import React from 'react';

export async function generateMetadata({ params }) {
  const { channelname } = await params;
  const { playlists: channelData } = await getChannnelDataBySlug(channelname); // Fetch channel data by slug

  const playlistnames = channelData.map((item) => item.playlistName).join(', ');

  if (!channelData || channelData.length === 0) return {};
  const channelName = channelData[0]?.playlistName || '';
  const canonicalUrl = `${process.env.SITE_PATH}/channel/${channelname}`;
  const image = channelData[0]?.thumbnail_240_url || process.env.OG_IMAGE;

  const meta = {
    title: `Latest News Videos by Playlist – ${playlistnames} & More | Lokmat TV`,
    description: `Watch the latest videos from ${playlistnames} on LokmatTV. Stay updated with trending news, entertainment, and more.`,
    keywords:
      'Lokmat news videos, latest news videos, trending news videos, breaking news India, Marathi news video playlists, Hindi news video updates, daily news clips, top news videos today, regional news videos, curated video playlists, political news videos, entertainment news videos, watch news online, video headlines India, Lokmat Marathi news, Lokmat video updates, Indian news video collection',
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    metadataBase: new URL(GLOBAL_CONFIG.SITE_PATH),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonicalUrl,
      siteName: GLOBAL_CONFIG.OG_SITE_NAME,
      images: [
        {
          url: image,
          width: 686,
          height: 514,
          type: 'image/jpeg',
        },
      ],
      locale: GLOBAL_CONFIG.META_OG_LOCALE,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      site: GLOBAL_CONFIG.META_TW_SITE,
      creator: GLOBAL_CONFIG.META_TW_CREATOR,
      images: [image],
    },
    other: {
      'twitter:url': canonicalUrl,
      'twitter:player:width': '480',
      'twitter:player:height': '270',
    },
  };
}

const page = async ({ params }) => {
  const { channelname } = await params;

  const { playlists: data, screenname } = await getChannnelDataBySlug(channelname);

  const breadcrumbJsonld = getBreadcrumbListJsonld([
    { name: 'Videos', url: `${GLOBAL_CONFIG.SITE_PATH}/videos/` },
    {
      name: screenname,
      url: `${GLOBAL_CONFIG.SITE_PATH}/videos/channel/${channelname}`,
    },
  ]);

  // console.log({
  //   name: screenname,
  //   playlist: data,
  // });
  const channelJsonLd = PlaylistJsonLd({
    name: screenname,
    playlist: data,
  });

  const firstPlaylist = data[0] || [];
  const topStories = firstPlaylist?.videos || [];
  const topStoriesTitle = firstPlaylist.playlistName;
  const topStoriesSlug = firstPlaylist.slug;

  const topStoriesId = firstPlaylist.id;

  return (
    <>
      <JsonLdWebPage
        url={`${GLOBAL_CONFIG.SITE_PATH}/videos/channel/${channelname}`}
        name={screenname}
        description={'Latest videos from ' + screenname}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonld) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(channelJsonLd),
        }}
      />
      <BackButton title={screenname} />

      <NewsLayout
        data={topStories}
        title={topStoriesTitle}
        slug={topStoriesSlug}
        id={topStoriesId}
      />

      {data?.slice(1).map((item, index) => (
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
