export const dynamic = 'force-static';
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import BackButton from '@/app/components/BackButton';
import CategoryCard from '@/app/components/CategoryCard';
import InfiniteScroll from '@/app/components/InfiniteScroll';
import { fetchPlaylistDataById } from '@/app/lib/FetchData';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async ({ params }) => {
  const { slug, videoId } = await params;

  const data = await fetchPlaylistDataById(videoId);

  if (!data) {
    return redirect(`/playlist/${slug}`);
  }

  const firstVideo = data?.videos[0] || [];

  return (
    <>
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
          <CategoryCard key={index} data={item} slug={slug} videoId={videoId} />
        ))}
        <InfiniteScroll slug={data?.slug} videoId={data?.id} startPage={2} />
      </div>
    </>
  );
};

export default page;
