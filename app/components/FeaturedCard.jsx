'use client';

import { useRouter } from 'next/navigation';
import { slugify } from '../lib/utility';

const FeaturedCard = ({ channel }) => {
  const router = useRouter();
  const url = `/videos/channel/${slugify(channel?.screenname)}`;

  return (
    <div className="card-wraper" onClick={() => router.push(url)}>
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
    </div>
  );
};

export default FeaturedCard;
