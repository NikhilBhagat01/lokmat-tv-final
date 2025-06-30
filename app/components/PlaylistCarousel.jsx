'use client';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import useMounted from '../hooks/useMounted';

const PlaylistCarousel = ({ data }) => {
  const { mounted, isMobile } = useMounted();
  const router = useRouter();
  // const slug = data?.title_slug || 'playlist';

  // console.log(data);

  return (
    <section className="lkm-widget">
      <div className="videos-head">
        <h3 className="head-title">{data?.title}</h3>
        <Link href={`/playlist/${data?.title_slug}`} className="read-all">
          Explore All
        </Link>
      </div>

      {/* DESKTOP: owl-carousel */}
      {mounted && !isMobile ? (
        <section className="owl-carousel owl-theme grid-view multiple">
          {data?.data?.list.map((item, index) => (
            <figure
              key={index}
              onClick={() => router.push(`/playlist/${data?.title_slug}/${item?.id}`)}
            >
              <div className="grid-container">
                <div className="imgwrap">
                  <img
                    className="lazy-img lazy-loaded"
                    src={item?.thumbnail_240_url}
                    alt={item?.name}
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <h2>
                    <span className="video-title">{item?.name}</span>
                    <span className="no-videos">{item?.videos_total} videos</span>
                    <span className="read-all"></span>
                  </h2>
                </figcaption>
              </div>
            </figure>
          ))}
        </section>
      ) : (
        // MOBILE: normal stacked/grid layout
        <section className=" grid-view multiple">
          {data?.data?.list.map((item, index) => (
            <figure
              key={index}
              onClick={() => router.push(`/playlist/${data?.title_slug}/${item?.id}`)}
            >
              <div className="grid-container">
                <div className="imgwrap">
                  <img
                    className="lazy-img lazy-loaded"
                    src={item?.thumbnail_240_url}
                    alt={item?.name}
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <h2>
                    <span className="video-title">{item?.name}</span>
                    <span className="no-videos">{item?.videos_total} videos</span>
                    <span className="read-all"></span>
                  </h2>
                </figcaption>
              </div>
            </figure>
          ))}
        </section>
      )}
    </section>
  );
};

export default PlaylistCarousel;
