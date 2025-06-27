'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import useMounted from '../hooks/useMounted';
import 'swiper/css';
import 'swiper/css/navigation';

const NewsLayout = ({ data, title, slug, id }) => {
  const { mounted, isMobile } = useMounted();
  const [selectedItem, setSelectedItem] = useState(data[0]);
  const [showVideo, setShowVideo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(data.length > 1);
  const swiperRef = useRef(null);

  // Handle auto-play logic
  useEffect(() => {
    if (!mounted || isMobile || !data.length) return;

    setShowVideo(false);

    const videoTimer = setTimeout(() => setShowVideo(true), 2000);
    const slideTimer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % data.length;
      setActiveIndex(nextIndex);
      setSelectedItem(data[nextIndex]);
      swiperRef.current?.slideTo(nextIndex);
    }, 10000);

    return () => {
      clearTimeout(videoTimer);
      clearTimeout(slideTimer);
    };
  }, [activeIndex, isMobile, mounted]);

  return (
    <section className="lead-video-container">
      {/* Top Video/Image Section */}
      <section className="video-container">
        <div className="iframe-container lg">
          {showVideo ? (
            <iframe
              src={`https://www.dailymotion.com/widget/preview/video/${selectedItem?.id}?title=none&duration=none&mode=video&trigger=auto`}
              title="Dailymotion Video"
              allowFullScreen
              loading="lazy"
              className=""
            />
          ) : (
            <img
              src={selectedItem?.thumbnail_240_url}
              alt="Press"
              loading="lazy"
              style={{ width: '100%' }}
            />
          )}
        </div>
        <div className="video-details-container">
          <p className="video-title">{selectedItem?.title}</p>
          <div>
            <Link
              href={`/videos/${slug}/${id}/${selectedItem?.id}`}
              className="play-button play-triangle"
            >
              Play
            </Link>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="lkm-widget">
        <div className="videos-head">
          <h3 className="head-title">{title}</h3>
          <Link href={`/videos/${slug}`} className="read-all">
            Explore All
          </Link>
        </div>

        <div className="videos-widget card-category-desktop home first">
          {mounted && (
            <>
              <Swiper
                spaceBetween={10}
                slidesPerView={isMobile ? 1.2 : 5.7}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  setCanSlidePrev(!swiper.isBeginning);
                  setCanSlideNext(!swiper.isEnd);
                }}
                onSlideChange={(swiper) => {
                  const index = swiper.activeIndex;
                  setActiveIndex(index);
                  setSelectedItem(data[index]);
                  setCanSlidePrev(!swiper.isBeginning);
                  setCanSlideNext(!swiper.isEnd);
                }}
                modules={[Navigation]}
                navigation={false}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 5.4 },
                }}
              >
                {data.map((item, index) => (
                  <SwiperSlide key={item.id}>
                    <div
                      onClick={() => {
                        setSelectedItem(item);
                        setActiveIndex(index);
                        setShowVideo(false);
                        swiperRef.current?.slideTo(index);
                      }}
                      className={`card-wraper ${item.id === selectedItem.id ? 'active' : ''}`}
                    >
                      <div
                        className="card upvideo card-image"
                        data-id={item.id}
                        data-title={item.title}
                      >
                        <div
                          className="card-image "
                          style={{
                            background: `url('${item.thumbnail_240_url}') center center / cover no-repeat`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {canSlidePrev && (
                <button
                  className="swiper-button-prev-custom"
                  onClick={() => swiperRef.current?.slidePrev()}
                >
                  &#8592;
                </button>
              )}
              {canSlideNext && (
                <button
                  className="swiper-button-next-custom"
                  onClick={() => swiperRef.current?.slideNext()}
                >
                  &#8594;
                </button>
              )}
            </>
          )}
        </div>

        {/* Optional Custom Controls */}
        <div className="dots ">
          {data.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => {
                swiperRef.current?.slideTo(i);
                setSelectedItem(data[i]);
                setActiveIndex(i);
                setShowVideo(false);
              }}
            ></span>
          ))}
        </div>
      </section>
    </section>
  );
};

export default NewsLayout;
