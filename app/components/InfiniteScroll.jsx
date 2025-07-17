'use client';

import React, { useEffect, useRef, useState } from 'react';
import CategoryCard from './CategoryCard';

const InfiniteScroll = ({ slug, videoId, startPage }) => {
  const [page, setPage] = useState(startPage);
  const [videos, setVideos] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const loadMore = async () => {
    if (!hasMore) return;

    const res = await fetch(
      `https://api.dailymotion.com/playlist/${videoId}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=12&page=${page}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36',
        },
      }
    );
    const data = await res.json();

    if (data?.list?.length > 0) {
      setVideos((prev) => [...prev, ...data.list]);
      setPage((prev) => prev + 1);
      if (!data.has_more) setHasMore(false);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      {
        threshold: 0.5,
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, page]); // <- remove loaderRef.current from deps

  return (
    <>
      {videos?.map((item, index) => (
        <CategoryCard key={`auto-${index}`} data={item} slug={slug} videoId={videoId} />
      ))}
      {/* {hasMore && <div ref={loaderRef}>Loading...</div>} */}
      {hasMore && <div className="skeleton-box" ref={loaderRef}></div>}
    </>
  );
};

export default InfiniteScroll;
