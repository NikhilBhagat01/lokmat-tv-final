export const dynamic = 'force-static';
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import BackButton from '@/app/components/BackButton';
import CategoryCard from '@/app/components/CategoryCard';
import InfiniteScroll from '@/app/components/InfiniteScroll';
import PrevNext from '@/app/components/PrevNext';
import { GLOBAL_CONFIG } from '@/app/config/config';
import { getBreadcrumbListJsonld, HubPageJsonLd, JsonLdWebPage } from '@/app/jsonld';
import { fetchPlaylistDataById } from '@/app/lib/FetchData';
import { deslugify, getPaginationUrls, slugify } from '@/app/lib/utility';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

export async function generateMetadata({ params }) {
  const { slug, videoId } = await params;

  // const data = await fetchPlaylistDataById(videoId);

  const categoryName = deslugify(videoId);
  // console.log(data);

  const meta = {
    title: `${categoryName} - Lokmat TV Videos | Lokmat.com`,
    description: `Watch latest ${categoryName} videos on Lokmat TV. Stay updated with breaking news, exclusive stories, and trending videos from ${categoryName}.`,
    keywords: `${categoryName}, Lokmat TV, Marathi news, video news, latest ${categoryName} news, ${categoryName} videos, news updates, Lokmat live`,
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    metadataBase: new URL(GLOBAL_CONFIG.SITE_PATH),
    alternates: {
      canonical: `/playlist/${slug}/${videoId}`,
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
      url: `${GLOBAL_CONFIG.SITE_PATH}/playlist/${slug}/${videoId}`,
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
      'twitter:url': `${GLOBAL_CONFIG.SITE_PATH}/playlist/${slug}/${videoId}`,
      'twitter:player:width': '480',
      'twitter:player:height': '270',
    },
  };
}

const page = async ({ params }) => {
  const { slug, videoId } = await params;

  const data = await fetchPlaylistDataById(videoId);

  console.log(data);
  if (!data) {
    return redirect(`/playlist/${slug}`);
  }

  // Next prev
  const page = typeof number !== 'undefined' ? parseInt(number) : 1;

  const { nextUrl, prevUrl } = getPaginationUrls({
    slug,
    page,
    hasMore: data?.has_more,
    isPlayList: true,
    videoId,
  });

  // Jsonld
  const breadcrumbJsonld = getBreadcrumbListJsonld([
    // { name: 'Videos', url: `${GLOBAL_CONFIG.SITE_PATH}/playlist/` },
    {
      name: data?.playlistName,
      url: `${GLOBAL_CONFIG.SITE_PATH}/playlist/${slug}/${videoId}`,
    },
  ]);

  const HubpageJsonLd = HubPageJsonLd({
    slug: data?.slug,
    name: data?.playlistName,
    data: data?.videos,
  });

  const firstVideo = data?.videos[0] || [];

  return (
    <>
      <JsonLdWebPage
        url={`${GLOBAL_CONFIG.SITE_PATH}/playlist/${slug}/${videoId}`}
        name={data?.playlistName}
        description={data?.playlistName}
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
      <BackButton slug={data?.slug} />
      <section className="lead-video-container ">
        <section className="video-container">
          <div className="iframe-container lg">
            {' '}
            <iframe
              src={`https://www.dailymotion.com/widget/preview/video/${firstVideo.id}?title=none&duration=none&mode=video&trigger=auto`}
              title="Dailymotion Video"
              allowFullScreen
              loading="lazy"
              className=""
            />
          </div>
          <div className="video-details-container">
            <p className="video-title">{firstVideo.title || 'No Title Available'}</p>
            <div className="">
              <Link
                href={`/videos/${videoId}/${firstVideo.slug}`}
                className="play-button play-triangle"
              >
                Play
              </Link>
            </div>
          </div>
        </section>
      </section>

      <div className="list-view card-category-desktop">
        {data?.videos?.slice(1).map((item, index) => (
          <CategoryCard key={index} data={item} slug={slug} videoId={videoId} isPlayList />
        ))}
        {/* <InfiniteScroll slug={data?.slug} videoId={data?.id} startPage={2} /> */}
      </div>
      <PrevNext prevUrl={prevUrl} nextUrl={nextUrl} />
    </>
  );
};

export default page;
