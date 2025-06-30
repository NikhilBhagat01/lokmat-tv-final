'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import useMounted from '../hooks/useMounted';
import { useRouter } from 'next/navigation';
import { getFormatedData, getFormatedDuration } from '../lib/utility';

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

  useEffect(() => {
    return () => {
      clearTimeout(previewTimeout.current);
    };
  }, []);

  return (
    <div
      className="card-wraper item"
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
              loading="lazy"
              title={item.title}
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
          <div className="card-date">{getFormatedData(item?.created_time)}</div>
          <div className="card-title">{item?.title}</div>
          <div className="card-footer">
            <span className="card-source">Lokmat .</span>
            <span className="card-category">news</span>
            <i className="arrow-icon play-triangle">
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
  const owlRef = useRef(null);

  return (
    <section className="lkm-widget">
      <div className="videos-head">
        <h3 className="head-title">{title}</h3>
        <Link href={`/videos/${slug}/${id}`} className="read-all">
          Explore All
        </Link>
      </div>

      {/* Desktop: Owl Carousel / Mobile: static list */}
      {mounted && !isMobile ? (
        <div
          className="videos-widget card-category-desktop home one owl-carousel owl-theme"
          ref={owlRef}
        >
          {data?.map((item, index) => (
            <CardItem
              key={item?.id || index}
              item={item}
              slug={slug}
              categoryId={id}
              withPreview={true}
            />
          ))}
        </div>
      ) : (
        <div className="videos-widget card-category-desktop home one">
          {data?.map((item, index) => (
            <CardItem
              key={item?.id || index}
              item={item}
              slug={slug}
              categoryId={id}
              withPreview={false}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default VideoCarousel;
