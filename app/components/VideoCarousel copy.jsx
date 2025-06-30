'use client';

import Link from 'next/link';
import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import useMounted from '../hooks/useMounted';
import { getFormatedDuration } from '../lib/utility';

const CardItem = React.memo(({ item, slug, categoryId, withPreview }) => {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const previewTimeout = useRef(null);

  const handleMouseEnter = useCallback(() => {
    previewTimeout.current = setTimeout(() => {
      setShowPreview(true);
    }, 1000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(previewTimeout.current);
    setShowPreview(false);
  }, []);

  return (
    <div
      className="card-wraper"
      onClick={() => router.push(`/videos/${slug}/${categoryId}/${item.id}`)}
    >
      <div
        className="card iframInsert gotovideoDetail"
        onMouseEnter={withPreview ? handleMouseEnter : undefined}
        onMouseLeave={withPreview ? handleMouseLeave : undefined}
      >
        <div className="card-image imgwrap">
          {withPreview && showPreview ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.dailymotion.com/widget/preview/video/${item.id}?title=none&duration=none&mode=video&trigger=auto`}
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <img
              className="lazy-img lazy-loaded"
              src={item.thumbnail_240_url}
              alt={item.title}
              loading="lazy"
            />
          )}
        </div>
        <div className="card-content">
          <div className="card-date">{item.date}</div>
          <div className="card-title">{item.title}</div>
          <div className="card-footer">
            <span className="card-source">Lokmat .</span>
            <span className="card-category">news</span>
            <i className="arrow-icon play-triangle">
              {/* <span>{item.duration}</span> */}
              <span>{getFormatedDuration(item?.duration)}</span>
            </i>
          </div>
        </div>
      </div>
    </div>
  );
});

const VideoCarousel = ({ title, slug, data, id }) => {
  const { mounted, isMobile } = useMounted();

  // console.log(data);
  const isDesktop = mounted && !isMobile;

  return (
    <section className="lkm-widget">
      <div className="videos-head">
        <h3 className="head-title">{title}</h3>
        <Link href={`/videos/${slug}/${id}`} className="read-all">
          Explore All
        </Link>
      </div>

      <div className="videos-widget card-category-desktop home one">
        {isDesktop ? (
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
              <SwiperSlide key={item.id || index} className="swiper-slide">
                <CardItem item={item} slug={slug} categoryId={id} withPreview />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <>
            {data?.map((item, index) => (
              <CardItem
                key={item.id || index}
                item={item}
                slug={slug}
                categoryId={id}
                withPreview={false}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default VideoCarousel;
