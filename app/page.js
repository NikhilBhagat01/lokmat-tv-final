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
import Featuredchannel from './components/Featuredchannel';

const meta = {
  title:
    'Online Marathi Videos: News Bulletin, News Videos Clips, Maharashtra, Mumbai, Pune, Entertainment, Sports, Lifestyle, Astrology, Technology, Auto Video Online from Lokmat.com',
  description:
    'Watch Online Marathi Videos, News Bulletin, News Video Clips, Entertainment Videos, Sports Videos, Lifestyle Videos, Astrology Videos, Technology Videos, Auto Videos Only on Lokmat.com',
  keywords:
    'online marathi videos, online news bulletin, news video clips, Maharashtra videos, Mumbai videos, pune videos, entertainment videos, sports videos, lifestyle videos, astrology videos, technology videos, auto videos, lokmat, online Marathi news bulletin',
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
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
    title: meta.title,
    description: meta.description,
    url: `${GLOBAL_CONFIG.SITE_PATH}/videos`,
    siteName: GLOBAL_CONFIG.OG_SITE_NAME,
    images: [
      {
        url: GLOBAL_CONFIG.OG_IMAGE,
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
    images: [GLOBAL_CONFIG.OG_IMAGE],
  },
  other: {
    'twitter:url': `${GLOBAL_CONFIG.SITE_PATH}/videos`,
  },
};

export default async function Home() {
  const data = await fetchAllDailymotionData();

  const breadcrumbJsonld = getBreadcrumbListJsonld([
    { name: 'Videos', url: `${GLOBAL_CONFIG.SITE_PATH}/videos/` },
  ]);
  const Jsonld = getHomePageJsonLd(data);

  const topStories = data[0]?.data || [];
  const topStoriesTitle = data[0]?.title;
  const topStoriesSlug = data[0]?.title_slug;
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
        <NewsLayout data={topStories} title={topStoriesTitle} slug={topStoriesSlug} />
        {data?.slice(1).map((item, index) => (
          <React.Fragment key={index}>
            {/* {index % 2 === 0 && <Adbox key={`ad-${index}`} width="800px" height="100px" />} */}
            {item?.isFeaturedChannel ? (
              <Featuredchannel data={item} /> // <Featuredchannel data={item} />
            ) : item?.isPlaylist ? (
              <PlaylistCarousel data={item} />
            ) : (
              <VideoCarousel
                title={item?.title}
                slug={item?.title_slug}
                data={item?.data || []}
                id={item?.id}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
