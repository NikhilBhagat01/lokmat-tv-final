'use client';
import { useState } from 'react';
import DailymotionLogo from './DailymotionLogo';

export default function VideoDetailCard({ description }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="info-desc-wrapper">
      <div className={`info-desc ${expanded ? 'active' : ''}`}>
        <div dangerouslySetInnerHTML={{ __html: description }} />
        <div className="dm__info-tags">
          <span>#Marathi batmya</span>
          <span>#Marathi batmya</span>
          <span>#Marathi batmya</span>
          <span>#Marathi batmya</span>
          <span>#Marathi batmya</span>
          <span>#Marathi batmya</span>
        </div>
        {/* {description.length > 0 ? <DailymotionLogo /> : null} */}
      </div>

      <div className="dm__more-btn" onClick={() => setExpanded(!expanded)}>
        <span>{expanded ? 'Show Less' : 'Learn More'}</span>
      </div>
    </div>
  );
}
