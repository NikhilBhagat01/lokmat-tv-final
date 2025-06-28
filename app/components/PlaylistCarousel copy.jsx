'use client';
import Link from 'next/link';
import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Core Swiper
import 'swiper/css/navigation'; // Optional: arrows
import { Navigation, Pagination } from 'swiper/modules';
import useMounted from '../hooks/useMounted';

const PlaylistCarousel = ({ data }) => {
  const { mounted, isMobile } = useMounted();
  console.log(data);
  return (
    <>
      <section className="lkm-widget">
        <div className="videos-head">
          <h3 className="head-title">{data?.title}</h3>
          <Link href={`/playlist/${data?.title_slug}`} className="read-all">
            Explore All
          </Link>
        </div>

        <section className="grid-view multiple ">
          {mounted && !isMobile ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={5.1}
              navigation
              pagination={{ clickable: true }}
              style={{ paddingRight: '1rem' }}
            >
              {data?.data?.list.map((item, index) => (
                <SwiperSlide key={index}>
                  <figure
                    key={index}
                    onClick={() => {
                      console.log('hello');
                    }}
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
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            data?.data?.list.map((item, index) => ( <figure
                    key={index}
                    onClick={() => {
                      console.log('hello');
                    }}
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
                  </figure>)
          )}
        </section>
      </section>
    </>
  );
};

export default PlaylistCarousel;
