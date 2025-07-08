export const dynamic = 'force-static';
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import NewsLayout from './components/NewsLayout';
import PlaylistCarousel from './components/PlaylistCarousel';
import { fetchAllDailymotionData } from './lib/FetchData';
import React from 'react';
import Adbox from './components/Adbox';
import VideoCarousel from './components/VideoCarousel';

import { getBreadcrumbListJsonld, getHomePageJsonLd, JsonLdWebPage } from './jsonld';
import { GLOBAL_CONFIG } from './config/config';

export const metadata = {
  title: 'Lokmat TV - Latest News & Videos',
  description:
    'Watch the latest news, entertainment, and trending video content from Lokmat TV. Stay updated with breaking news, exclusive stories, and popular playlists.',
  keywords:
    'Lokmat TV, Marathi news, breaking news, latest news, video news, Maharashtra news, entertainment news, viral videos, news updates, Lokmat live',
  metadataBase: new URL(GLOBAL_CONFIG.SITE_PATH),
  alternates: {
    canonical: '/videos',
  },
  links: [
    {
      rel: 'amphtml',
      href: `${GLOBAL_CONFIG.SITE_PATH}/videos/amp/`,
    },
  ],
  openGraph: {
    title: 'Lokmat TV - Latest News & Videos',
    description: 'Watch the latest news, entertainment, and trending video content from Lokmat TV.',
    url: `${GLOBAL_CONFIG.SITE_PATH}/videos`,
    siteName: 'LokmatTV',
    images: [
      {
        url: 'https://d3pc1xvrcw35tl.cloudfront.net/images/686x514/homepage-og_201912337337.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'mr_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lokmat TV - Latest News & Videos',
    description: 'Watch the latest news, entertainment, and trending video content from Lokmat TV.',
    images: ['https://d3pc1xvrcw35tl.cloudfront.net/images/686x514/homepage-og_201912337337.jpg'],
  },
};

export default async function Home() {
  const data = await fetchAllDailymotionData();

  const breadcrumbJsonld = getBreadcrumbListJsonld([
    { name: 'Videos', url: `${GLOBAL_CONFIG.SITE_PATH}/videos/` },
  ]);
  const Jsonld = getHomePageJsonLd(data);

  const topStories = data[0]?.data?.list || [];
  const topStoriesTitle = data[0]?.title;
  const topStoriesSlug = data[0]?.title_slug;
  const topStoriesId = data[0]?.id;
  return (
    <>
      <JsonLdWebPage
        name="Marathi News Videos | ताज्या मराठी बातम्यांचे व्हिडीओ | Latest Video News from Maharashtra & Mumbai | Lokmat.com"
        description="Watch the latest Marathi news videos on Lokmat.com. Stay updated with breaking video news from Maharashtra, Mumbai, Pune and all over India. Get ताज्या मराठी बातम्यांचे व्हिडीओ including politics, entertainment, sports & more."
        keywords="Marathi News Videos, Marathi Video News, ताज्या मराठी बातम्यांचे व्हिडीओ, Video News in Marathi, Maharashtra News Videos, Mumbai News Videos, Pune News Videos, Latest Marathi Video News, Breaking Marathi News Videos"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonld) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(Jsonld),
        }}
      />
      <div className="video-wrapper">
        <NewsLayout
          data={topStories}
          title={topStoriesTitle}
          slug={topStoriesSlug}
          id={topStoriesId}
        />
        {data?.slice(1).map((item, index) => (
          <React.Fragment key={index}>
            {/* {index % 2 === 0 && <Adbox key={`ad-${index}`} width="800px" height="100px" />} */}
            {item?.isFeaturedChannel ? (
              <></>
            ) : // <Featuredchannel data={item} />
            item?.isPlaylist ? (
              <PlaylistCarousel data={item} />
            ) : (
              <VideoCarousel
                title={item?.title}
                slug={item?.title_slug}
                data={item?.data?.list || []}
                id={item?.id}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
