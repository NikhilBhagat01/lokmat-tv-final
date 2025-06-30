'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { getFormatedData, getFormatedDuration } from '../lib/utility';

const CategoryCard = ({ data, slug, videoId }) => {
  const router = useRouter();

  // console.log(`/videos/${slug}/${data.id}`);
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
      </div>
    </div>
  );
};

export default CategoryCard;
