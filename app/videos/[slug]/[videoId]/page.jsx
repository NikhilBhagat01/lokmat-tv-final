export const dynamic = 'auto';
export const revalidate = 180;

import BackButton from '@/app/components/BackButton';
import CategoryCard from '@/app/components/CategoryCard';
import Link from 'next/link';
import React from 'react';

const page = async ({ params }) => {
  const { videoId, slug } = await params;

  const response = await fetch(
    `https://api.dailymotion.com/playlist/${videoId}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=12&page=1`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36',
      },
    }
  );

  const data = await response.json();
  // console.log(data);
  const firstVideo = data.list[0] || [];
  // console.log(firstVideo);

  return (
    <>
      <BackButton slug={slug} />
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
        {data?.list?.slice(1).map((item, index) => (
          <CategoryCard key={index} data={item} slug={slug} videoId={videoId} />
        ))}
      </div>
    </>
  );
};

export default page;
