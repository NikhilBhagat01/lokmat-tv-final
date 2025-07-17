// components/InfiniteRelatedVideos.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import RelatedVideosCardWrapper from './RelatedVideosCardWrapper';

const InfiniteRelatedVideos = ({ videoId, slug, startPage = 2 }) => {
  const [page, setPage] = useState(startPage);
  const [videos, setVideos] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const fetchMore = async () => {
    try {
      const res = await fetch(
        `https://api.dailymotion.com/playlist/${videoId}/videos?fields=id,thumbnail_240_url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=12&page=${page}`
      );
      const data = await res.json();

      if (data?.list?.length > 0) {
        setVideos((prev) => [...prev, ...data.list]);
        setPage((prev) => prev + 1);
        if (!data.has_more) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
      setHasMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && hasMore) {
          fetchMore();
        }
      },
      { threshold: 0.5 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, page]);

  return (
    <>
      {videos.map((video) => (
        <RelatedVideosCardWrapper key={video.id} video={video} videoId={videoId} slug={slug} />
      ))}
      {hasMore && <div ref={loaderRef}>Loading...</div>}
    </>
  );
};

export default InfiniteRelatedVideos;
