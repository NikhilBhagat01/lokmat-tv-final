'use client';

import { moveItem } from 'framer-motion';
import React, { useState } from 'react';
import useMounted from '../hooks/useMounted';
import Link from 'next/link';

const NewsLayout = ({ data, title, slug, id }) => {
  const { mounted, isMobile } = useMounted();
  const [selectedItem, setSelectedItem] = useState(data[0]);
  const [showVideo, setShowVideo] = useState(false);

  // console.log(selectedItem);
  return (
    <>
      <section className="lead-video-container">
        {/* Top Story */}
        <section className="video-container">
          {/* iframe will be here */}
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
                className=""
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
        <section className="lkm-widget">
          {/* heading text */}
          <div className="videos-head">
            <h3 className="head-title">{title}</h3>
            <Link href={`/videos/${slug}`} className="read-all">
              Explore All
            </Link>
          </div>

          <div className="videos-widget card-category-desktop home first">
            {/* card-wraper */}
            {mounted
              ? data?.map((item, index) => (
                  <div
                    className={`card-wraper ${item.id == selectedItem.id ? 'active' : ''}`}
                    key={index}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div
                      className="card upvideo"
                      // data-index="0"
                      data-id={item.id}
                      data-title={item.title}
                    >
                      <div
                        className="card-image"
                        //   style="background: url('https://s1.dmcdn.net/v/YN7X61e9AhsWdKdN1/x240') center center / cover no-repeat;"
                        style={{
                          background: `url('${item.thumbnail_240_url}') center center / cover no-repeat`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              : data?.map((item, index) => (
                  <div className="card-wraper " key={index}>
                    <div
                      className="card upvideo"
                      // data-index="0"
                      data-id={item.id}
                      data-title={item.title}
                    >
                      <div
                        className="card-image"
                        //   style="background: url('https://s1.dmcdn.net/v/YN7X61e9AhsWdKdN1/x240') center center / cover no-repeat;"
                        style={{
                          background: `url('${item.thumbnail_240_url}') center center / cover no-repeat`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
          </div>
          <div className="dots">
            {/* <span className="dot active" onclick="jumpToGroup(0)"></span>
            <span className="dot" onclick="jumpToGroup(1)"></span> */}
            <span className="dot active" onClick={() => {}}></span>
            <span className="dot" onClick={() => {}}></span>
          </div>
          <div className="controls">
            <button onClick={() => {}}></button>
            <button onClick={() => {}}></button>
          </div>
        </section>
      </section>
      ;
    </>
  );
};

export default NewsLayout;
