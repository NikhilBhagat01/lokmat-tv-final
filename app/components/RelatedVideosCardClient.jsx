// components/RelatedVideosCardClient.jsx
'use client';

import { getFormatedData, getFormatedDuration } from '../lib/utility';
import Link from 'next/link';

const RelatedVideosCard = ({ video, slug }) => {
  const url = `/videos/${slug}/${video?.slug}`;

  return (
    <div className="card-wraper">
      <Link href={url} className="card gotovideoDetail">
        <div className="card-image imgwrap">
          <img
            className="lazy-img"
            src={video.thumbnail_240_url}
            alt={video.title}
            loading="lazy"
          />
        </div>
        <div className="card-content">
          <div className="card-date">{getFormatedData(video?.created_time)}</div>
          <div className="card-title">{video.title}</div>
          <div className="card-footer">
            <span className="card-source">{video['owner.screenname']} . </span>
            <span className="card-category">{video.channel}</span>
            <i className="arrow-icon play-triangle">
              <span>{getFormatedDuration(video?.duration)}</span>
            </i>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RelatedVideosCard;
