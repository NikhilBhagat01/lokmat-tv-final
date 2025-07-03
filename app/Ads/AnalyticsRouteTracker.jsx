'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const AnalyticsRouteTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    //  Comscore reload beacon
    if (window._comscore) {
      window._comscore.push({ c1: '2', c2: process.env.NEXT_PUBLIC_COMSCORE_C2 });
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://sb.scorecardresearch.com/beacon.js';
      document.body.appendChild(s);
    }
  }, [pathname]);

  return null;
};

export default AnalyticsRouteTracker;
