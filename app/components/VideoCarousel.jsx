'use client';
import Link from 'next/link';
import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';
import useMounted from '../hooks/useMounted';
import { useRouter } from 'next/navigation';

const VideoCarousel = ({ title, slug, data, id }) => {
  const router = useRouter();

  const { mounted, isMobile } = useMounted();

  // console.log(`/videos/${slug}/${id}`);
  //   console.log(data);
  return (
    <section className="lkm-widget">
      <div className="videos-head">
        <h3 className="head-title">{title}</h3>
        <Link href={`/videos/${slug}/${id}`} className="read-all">
          Explore All
        </Link>
      </div>

      <div className="videos-widget card-category-desktop home one ">
        {mounted && !isMobile ? (
          <>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={5.1}
              navigation
              pagination={{ clickable: true }}
              style={{ paddingRight: '1rem' }}
              className="swiper"
            >
              {data?.map((item, index) => (
                <SwiperSlide key={index} className="swiper-slide">
                  <div
                    className="card-wraper"
                    key={index}
                    onClick={() => router.push(`/videos/${slug}/${id}/${item.id}`)}
                  >
                    <div className="card iframInsert gotovideoDetail">
                      <div className="card-image imgwrap">
                        <img
                          className="lazy-img lazy-loaded"
                          src={item.thumbnail_240_url}
                          alt={item.title}
                          loading="lazy"
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-date">{item.date}</div>
                        <div className="card-title">{item.title}</div>
                        <div className="card-footer">
                          <span className="card-source">Lokmat .</span>
                          <span className="card-category">news</span>
                          <i className="arrow-icon play-triangle">
                            <span>{item.duration}</span>
                          </i>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <>
            {data?.map((item, index) => (
              <div
                className="card-wraper"
                key={index}
                // onClick={() => router.push(`/videos/${slug}/${id}/${item.id}`)}
              >
                <div className="card iframInsert gotovideoDetail">
                  <div className="card-image imgwrap">
                    <img
                      className="lazy-img lazy-loaded"
                      src={item.thumbnail_240_url}
                      alt={item.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="card-content">
                    <div className="card-date">{item.date}</div>
                    <div className="card-title">{item.title}</div>
                    <div className="card-footer">
                      <span className="card-source">Lokmat .</span>
                      <span className="card-category">news</span>
                      <i className="arrow-icon play-triangle">
                        <span>{item.duration}</span>
                      </i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default VideoCarousel;
