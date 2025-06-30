'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const CategoryCard = ({ data, slug, videoId }) => {
  const router = useRouter();
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(data.created_time * 1000));

  console.log(`/videos/${slug}/${data.id}`);
  return (
    <div
      className="card-wraper"
      onClick={() => router.push(`/videos/${slug}/${videoId}/${data.id}`)}
    >
      <div className="card  ">
        <div className="card-image imgwrap">
          <img
            className=""
            src={data?.thumbnail_240_url}
            alt={data?.title || 'No Title Available'}
            loading="lazy"
          />
        </div>
        <div className="card-content">
          <div className="card-date">{formattedDate}</div>
          <div className="card-title">{data?.title || 'No Title Available'}</div>
          <div className="card-footer">
            {/* <span className="card-source">Lokmat .</span>{' '} */}
            {/* <span className="card-category">news</span> */}
            <i className="arrow-icon play-triangle">
              <span>
                {Math.floor(data?.duration / 60)}:
                {(data?.duration % 60).toString().padStart(2, '0')}
              </span>
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
