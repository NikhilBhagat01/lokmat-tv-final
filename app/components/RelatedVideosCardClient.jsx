// components/RelatedVideosCardClient.jsx
'use client';

import { useRouter } from 'next/navigation';
import { getFormatedData, getFormatedDuration } from '../lib/utility';

const RelatedVideosCard = ({ video, slug }) => {
  const router = useRouter();

  return (
    <div className="card-wraper" onClick={() => router.push(`/videos/${slug}/${video.id}`)}>
      <div className="card gotovideoDetail">
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
      </div>
    </div>
  );
};

export default RelatedVideosCard;
