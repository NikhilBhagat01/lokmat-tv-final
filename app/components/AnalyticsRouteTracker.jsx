'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const AnalyticsRouteTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    // 🔁 GA4 manual route change tracking (required if you use gtag.js)
    // if (typeof window.gtag === 'function') {
    //   console.log('in gtag');
    //   window.gtag('event', 'page_view', {
    //     page_path: pathname,
    //     page_location: window.location.href,
    //     page_title: document.title,
    //   });
    // }

    // 🔁 Comscore reload beacon
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
