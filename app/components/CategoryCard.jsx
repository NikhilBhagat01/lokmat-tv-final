'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getFormatedData, getFormatedDuration, slugify } from '../lib/utility';
import useMounted from '../hooks/useMounted';
import Link from 'next/link';

const CategoryCard = ({ data, slug, isPlayList = false, videoId = '' }) => {
  const url = isPlayList
    ? `/videos/${slugify(videoId)}/${data?.slug}`
    : `/videos/${slug}/${data.slug}`;
  const router = useRouter();
  const { mounted, isMobile } = useMounted();

  const [showPreview, setShowPreview] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const previewTimeout = useRef(null);

  const handleMouseEnter = useCallback(() => {
    previewTimeout.current = setTimeout(() => {
      setShowPreview(true);
    }, 1000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(previewTimeout.current);
    setShowPreview(false);
    setVideoLoaded(false);
  }, []);

  useEffect(() => {
    return () => clearTimeout(previewTimeout.current);
  }, []);

  return (
    <div
      className="card-wraper"
      onMouseEnter={!isMobile ? handleMouseEnter : undefined}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
    >
      <Link href={url} className="card  ">
        <div className="card-image imgwrap">
          {showPreview ? (
            <>
              {!videoLoaded && (
                <div className="spinner-overlay">
                  <div className="spinner" />
                </div>
              )}
              <iframe
                width="100%"
                height="100%"
                src={`https://www.dailymotion.com/widget/preview/video/${data?.id}?title=none&duration=none&mode=video&trigger=auto`}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                loading="lazy"
                title={data?.title}
                onLoad={() => setVideoLoaded(true)}
              />
            </>
          ) : (
            <img
              className=""
              src={data?.thumbnail_240_url}
              alt={data?.title || 'No Title Available'}
              loading="lazy"
            />
          )}
        </div>
        <div className="card-content">
          <div className="card-date">{getFormatedData(data?.created_time)}</div>
          <div className="card-title">{data?.title || 'No Title Available'}</div>
          <div className="card-footer">
            {/* <span className="card-source">Lokmat .</span>{' '} */}
            {/* <span className="card-category">news</span> */}
            <i className="arrow-icon play-triangle">
              <span>{getFormatedDuration(data?.duration)}</span>
            </i>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
