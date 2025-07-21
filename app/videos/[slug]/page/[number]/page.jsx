import BackButton from '@/app/components/BackButton';
import CategoryCard from '@/app/components/CategoryCard';
import { fetchCategoryDataBySlug } from '@/app/lib/FetchData';
import Link from 'next/link';
import React from 'react';

const page = async ({ params }) => {
  console.log(await params);
  const { slug, number } = await params;

  const data = await fetchCategoryDataBySlug(slug, number);

  const firstVideo = data?.playlistData[0] || [];

  console.log(data);

  return (
    <>
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
                href={`/videos/${data?.slug}/${firstVideo?.slug}`}
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
      </div>
    </>
  );
};

export default page;
