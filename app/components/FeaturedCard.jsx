'use client';

import { slugify } from '../lib/utility';
import Link from 'next/link';

const FeaturedCard = ({ channel }) => {
  const url = `/videos/channel/${slugify(channel?.screenname)}`;

  return (
    <Link href={url} className="card-wraper">
      <div className="cover">
        <div
          className="card-image"
          style={{
            background: `url(${channel?.cover_250_url}) no-repeat center center / cover`,
          }}
        ></div>
        <div className="dm-channel-info-wrapper">
          <div
            className="dm-channel-avatar"
            style={{
              background: `url(${channel?.avatar_60_url}) no-repeat center center / cover`,
            }}
          ></div>
          <div className="dm-channel-title">{channel?.screenname}</div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;
