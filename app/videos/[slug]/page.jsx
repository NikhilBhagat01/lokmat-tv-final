export const dynamic = 'force-static';
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import BackButton from '@/app/components/BackButton';
import CategoryCard from '@/app/components/CategoryCard';
import InfiniteScroll from '@/app/components/InfiniteScroll';
import { GLOBAL_CONFIG } from '@/app/config/config';
import { getBreadcrumbListJsonld, HubPageJsonLd, JsonLdWebPage } from '@/app/jsonld';
import { fetchCategoryDataBySlug } from '@/app/lib/FetchData';
import Link from 'next/link';
import React from 'react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await fetchCategoryDataBySlug(slug);

  if (!data) return {};

  // const firstPlaylist = data?.playlistData[0] || [];
  // const firstVideo = firstPlaylist?.videos?.[0] || {};
  const categoryName = data?.categoryName || '';

  const categoryMetadataMap = {
    entertainment: {
      title:
        'Latest Enetertainment Video Galleries | Bollwood & Hollywood Movie Videos & trailers| Celebrity Videos | Lokmat.com',
      description:
        'Entertainment video Gallery - Explore latest & trending Videos on Bollywood,Hollywood & south movies, entertainment & television awards, TV shows & events, fashion shows. Also explore Hot & Sexy Videos of Bollywood & Hollywood actors, actress, and models at Lokmat.com',
      keywords:
        'Bollywood Videos, Bollywood movie trailers & Videos, Hollywood movie Videos, Bollywood celebrity Videos, hollywood celebrity Videos, hot & sexy Video Galleries, Bollywood fashion shoot, Bollywoodfashion shows, Bollywood Videos, Videos of TV celebrities',
    },
  };

  const meta = categoryMetadataMap[categoryName] || {
    title: `${categoryName} - Lokmat TV Videos`,
    description: `Watch latest ${categoryName} videos on Lokmat TV. Stay updated with breaking news, exclusive stories, and trending videos from ${categoryName}.`,
    keywords: `${categoryName}, Lokmat TV, Marathi news, video news, latest ${categoryName} news, ${categoryName} videos, news updates, Lokmat live`,
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    metadataBase: new URL(GLOBAL_CONFIG.SITE_PATH),
    alternates: {
      canonical: `/videos/${slug}`,
    },
    links: [
      {
        rel: 'amphtml',
        href: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/amp/`,
      },
    ],
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}`,
      siteName: 'LokmatTV',
      images: [
        {
          url: data?.thumbnail_240_url || GLOBAL_CONFIG.OG_IMAGE,
          width: 686,
          height: 514,
        },
      ],
      locale: 'mr',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [data?.thumbnail_240_url || GLOBAL_CONFIG.OG_IMAGE],
    },
  };
}

const page = async ({ params }) => {
  const { slug } = await params;

  const data = await fetchCategoryDataBySlug(slug);

  const breadcrumbJsonld = getBreadcrumbListJsonld([
    { name: 'Videos', url: `${GLOBAL_CONFIG.SITE_PATH}/videos/` },
    { name: data?.categoryName, url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${data?.slug}` },
  ]);

  const HubpageJsonLd = HubPageJsonLd({
    slug: data?.slug,
    name: data?.categoryName,
    data: data?.playlistData,
  });

  const firstVideo = data?.playlistData[0] || [];

  return (
    <>
      <JsonLdWebPage
        url={`${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}`}
        name={data?.categoryName}
        description={data?.categoryName}
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
      <BackButton title={data?.categoryName} />
      <section className="lead-video-container ">
        <section className="video-container">
          <div className="iframe-container lg">
            <iframe
              src={`https://www.dailymotion.com/widget/preview/video/${firstVideo?.id}?title=none&duration=none&mode=video&trigger=auto`}
              title="Dailymotion Video"
              allowFullScreen
              loading="lazy"
              className=""
            />
          </div>
          <div className="video-details-container">
            <p className="video-title">{firstVideo?.title || 'No Title Available'}</p>
            <div className="">
              <Link
                href={`/videos/${data?.slug}/${firstVideo?.id}`}
                className="play-button play-triangle"
              >
                Play
              </Link>
            </div>
          </div>
        </section>
      </section>

      <div className="list-view card-category-desktop">
        {data?.playlistData?.slice(1).map((item, index) => (
          <CategoryCard key={index} data={item} slug={data?.slug} />
        ))}
        <InfiniteScroll slug={data?.slug} videoId={data?.id} startPage={2} />
      </div>
    </>
  );
};

export default page;
