export const dynamic = 'force-static';
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import BackButton from '@/app/components/BackButton';
import NewsLayout from '@/app/components/NewsLayout';
import VideoCarousel from '@/app/components/VideoCarousel';
import { GLOBAL_CONFIG } from '@/app/config/config';
import { getBreadcrumbListJsonld, JsonLdWebPage, PlaylistJsonLd } from '@/app/jsonld';
import { fetchPlaylistDataBySlug } from '@/app/lib/FetchData';
import { deslugify } from '@/app/lib/utility';
import { redirect } from 'next/navigation';
import React from 'react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const playlistData = await fetchPlaylistDataBySlug(slug);

  if (!playlistData) return {};

  const playlistName = playlistData?.playlistName || '';
  const canonicalUrl = `${GLOBAL_CONFIG.SITE_PATH}/playlist/${slug}`;
  const image = playlistData?.thumbnail_240_url || GLOBAL_CONFIG.OG_IMAGE;

  // Categorized meta logic
  const categoryMetaMap = {
    news: {
      title: `${playlistName} | Breaking News & Current Affairs - LokmatTV`,
      description: `Stay updated with the latest headlines, politics, and global affairs from ${playlistName}.`,
      keywords:
        'breaking news, video news, politics, lokmat headlines, current affairs, news today',
    },
    'city-news': {
      title: `${playlistName} | Local City News Videos - LokmatTV`,
      description: `Watch latest updates and news from your city in ${playlistName}.`,
      keywords: 'city news, local updates, nagpur news, pune news, maharashtra cities',
    },
    entertainment: {
      title: `${playlistName} | Celebrity News & Bollywood Buzz - LokmatTV`,
      description: `Catch up with Bollywood news, celebrity interviews and TV updates from ${playlistName}.`,
      keywords: 'bollywood news, celebrity gossip, movie trailers, tv shows, entertainment videos',
    },
    'social-viral': {
      title: `${playlistName} | Trending & Viral Social Videos - LokmatTV`,
      description: `Watch viral stories, trending reels and internet buzz from ${playlistName}.`,
      keywords: 'viral videos, trending news, social buzz, memes, internet trends, funny videos',
    },
    sakhi: {
      title: `${playlistName} | Women Lifestyle & Empowerment - LokmatTV`,
      description: `Explore health, fashion and inspiring women stories in ${playlistName}.`,
      keywords: 'women videos, empowerment, health tips, fashion, sakhi, lifestyle content',
    },
    bhakti: {
      title: `${playlistName} | Devotional Bhajans & Aartis - LokmatTV`,
      description: `Spiritual content including bhajans, kirtans and aartis from ${playlistName}.`,
      keywords: 'bhakti, devotional songs, bhajan, aarti, spiritual videos, religious content',
    },
    events: {
      title: `${playlistName} | Latest Cultural & Political Events - LokmatTV`,
      description: `Coverage of public, political and cultural events from ${playlistName}.`,
      keywords: 'event videos, public events, cultural shows, politics, lokmat events',
    },
    inspirational: {
      title: `${playlistName} | Motivational & Uplifting Stories - LokmatTV`,
      description: `Inspirational stories, real journeys, and motivational content from ${playlistName}.`,
      keywords: 'inspirational videos, motivational stories, life lessons, lokmat positivity',
    },
  };

  const lowerSlug = slug.toLowerCase();
  const meta = categoryMetaMap[lowerSlug] || {
    title: `${playlistName} | Latest Videos on LokmatTV`,
    description: `Watch the latest videos from ${playlistName} on LokmatTV.`,
    keywords: 'lokmat videos, trending clips, latest news, video playlist, lokmat tv',
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
  const { slug } = await params;
  // console.log(slug);

  const playlistData = await fetchPlaylistDataBySlug(slug);
  // console.log(playlistData);

  if (!playlistData) return redirect('/');

  const breadcrumbJsonld = getBreadcrumbListJsonld([
    {
      name: playlistData?.playlistName,
      url: `${GLOBAL_CONFIG.SITE_PATH}/playlist/${playlistData?.slug}/`,
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
        url={`${GLOBAL_CONFIG.SITE_PATH}/playlist/${slug}/`}
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
      <BackButton title={deslugify(slug)} />
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
