export const dynamic = 'auto';
export const revalidate = 180;

import BackButton from '@/app/components/BackButton';
import CategoryCard from '@/app/components/CategoryCard';
import InfiniteScroll from '@/app/components/InfiniteScroll';
import { GLOBAL_CONFIG } from '@/app/config/config';
import { getBreadcrumbListJsonld, HubPageJsonLd, JsonLdWebPage } from '@/app/jsonld';
import { slugify } from '@/app/lib/utility';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async ({ params }) => {
  const { videoId, slug } = await params;

  const nameUrl = `https://api.dailymotion.com/playlist/${videoId}/?fields=name`;
  const playlist_url = `https://api.dailymotion.com/playlist/${videoId}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=12&page=1`;

  const [nameResponse, playlistResponse] = await Promise.all([
    fetch(nameUrl, {
      next: { revalidate: 300 },
    }),
    fetch(playlist_url, {
      next: { revalidate: 300 },
    }),
  ]);

  if (!nameResponse.ok || !playlistResponse.ok) {
    return redirect('/');
  }

  const [nameData, playlistData] = await Promise.all([
    nameResponse.json(),
    playlistResponse.json(),
  ]);

  // console.log(slugify(nameData.name));

  if (slug !== slugify(nameData.name)) {
    return redirect(`/videos/${slugify(nameData.name)}/${videoId}`);
  }
  // console.log(playlistData);

  const breadcrumbJsonld = getBreadcrumbListJsonld([
    { name: 'Videos', url: `${GLOBAL_CONFIG.SITE_PATH}/videos/` },
    { name: nameData?.name, url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/${videoId}` },
  ]);
  const HubpageJsonLd = HubPageJsonLd({ slug, videoId, name: nameData.name, ...playlistData });

  const firstVideo = playlistData.list[0] || [];

  return (
    <>
      <JsonLdWebPage
        url={`${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/${videoId}`}
        name={nameData.name}
        description={nameData?.name}
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
      <BackButton slug={nameData.name} />
      <section className="lead-video-container ">
        <section className="video-container">
          <div className="iframe-container lg">
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
                href={`/videos/${slug}/${videoId}/${firstVideo.id}`}
                className="play-button play-triangle"
              >
                Play
              </Link>
            </div>
          </div>
        </section>
      </section>

      <div className="list-view card-category-desktop">
        {playlistData?.list?.slice(1).map((item, index) => (
          <CategoryCard key={index} data={item} slug={slug} videoId={videoId} />
        ))}
        {/* Infinite Scroll Client Component */}
        <InfiniteScroll slug={slug} videoId={videoId} startPage={2} />
      </div>
    </>
  );
};

export default page;
