'use client';
import { useState } from 'react';
import DailymotionLogo from './DailymotionLogo';

export default function VideoDetailCard({ data }) {
  const [expanded, setExpanded] = useState(false);
  // console.log(data);

  return (
    <div className="info-desc-wrapper">
      <div className={`info-desc ${expanded ? 'active' : ''}`}>
        <div dangerouslySetInnerHTML={{ __html: data?.description }} />
        <div className="dm__info-tags">
          {data?.tags?.map((tag, index) => (
            <span key={index}>{` #${tag}`}</span>
          ))}
        </div>
        {/* {description.length > 0 ? <DailymotionLogo /> : null} */}
      </div>

      <div className="dm__more-btn" onClick={() => setExpanded(!expanded)}>
        <span>{expanded ? 'Show Less' : 'Learn More'}</span>
      </div>
    </div>
  );
}
