'use client';
import { useState } from 'react';
import DailymotionLogo from './DailymotionLogo';

export default function VideoDetailCard({ description }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="info-desc-wrapper">
      <div className={`info-desc ${expanded ? 'active' : ''}`}>
        <div dangerouslySetInnerHTML={{ __html: description }} />
        {/* {description.length > 0 ? <DailymotionLogo /> : null} */}
      </div>

      <div className="dm__more-btn" onClick={() => setExpanded(!expanded)}>
        <span>{expanded ? 'Show Less' : 'Learn More'}</span>
      </div>
    </div>
  );
}
