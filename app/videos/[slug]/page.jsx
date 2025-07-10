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

// export async function generateMetadata({ params }) {
//   const { slug } = await params;
//   const data = await fetchCategoryDataBySlug(slug);

//   // console.log(data);
//   if (!data) return {};

//   const firstPlaylist = data?.playlistData[0] || [];
//   const firstVideo = firstPlaylist?.videos?.[0] || {};
//   const categoryName = firstPlaylist.playlistName || '';

//   return {
//     title: `${categoryName} - Lokmat TV Videos`,
//     description: `Watch latest ${categoryName} videos on Lokmat TV. Stay updated with breaking news, exclusive stories, and trending videos from ${categoryName}.`,
//     keywords: `${categoryName}, Lokmat TV, Marathi news, video news, latest ${categoryName} news, ${categoryName} videos, news updates, Lokmat live`,
//     metadataBase: new URL(GLOBAL_CONFIG.SITE_PATH),
//     alternates: {
//       canonical: `/videos/${slug}`,
//     },
//     links: [
//       {
//         rel: 'amphtml',
//         href: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/amp/`,
//       },
//     ],
//     openGraph: {
//       title: `${categoryName} - Lokmat TV Videos`,
//       description: `Watch latest ${categoryName} videos on Lokmat TV. Breaking news and exclusive stories from ${categoryName}.`,
//       url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}`,
//       siteName: 'LokmatTV',
//       images: [
//         {
//           url:
//             firstVideo?.thumbnail_240_url ||
//             'https://d3pc1xvrcw35tl.cloudfront.net/images/686x514/homepage-og_201912337337.jpg',
//           width: 1200,
//           height: 630,
//         },
//       ],
//       locale: 'mr_IN',
//       type: 'website',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: `${categoryName} - Lokmat TV Videos`,
//       description: `Watch latest ${categoryName} videos on Lokmat TV. Breaking news and exclusive stories.`,
//       images: [
//         firstVideo?.thumbnail_240_url ||
//           'https://d3pc1xvrcw35tl.cloudfront.net/images/686x514/homepage-og_201912337337.jpg',
//       ],
//     },
//   };
// }

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
