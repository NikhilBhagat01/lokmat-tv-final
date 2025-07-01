'use client';

import React, { useEffect, useRef, useState } from 'react';
import CategoryCard from './CategoryCard';

const InfiniteScroll = ({ slug, videoId, startPage }) => {
  const [page, setPage] = useState(startPage);
  const [videos, setVideos] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // console.log(slug);
  //   console.log(videos);
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
    // console.log(data);
    // console.log(page);

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
        // rootMargin: '200px',
        threshold: 0.5,
      }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loaderRef.current, hasMore]);

  return (
    <>
      {videos?.map((item, index) => (
        <CategoryCard key={`auto-${index}`} data={item} slug={slug} videoId={videoId} />
      ))}
      {hasMore && <div ref={loaderRef}>Loading...</div>}
    </>
  );
};

export default InfiniteScroll;
