'use client';

import Script from 'next/script';

const ComscoreAnalytics = () => {
  const c2 = process.env.NEXT_PUBLIC_COMSCORE_C2;

  if (!c2) return null;

  return (
    <Script id="comscore-init" strategy="afterInteractive">
      {`
        var _comscore = _comscore || [];
        _comscore.push({ c1: "2", c2: "${c2}" });

        (function() {
          var s = document.createElement("script"), el = document.getElementsByTagName("script")[0];
          s.async = true;
          s.src = "https://sb.scorecardresearch.com/beacon.js";
          el.parentNode.insertBefore(s, el);
        })();
      `}
    </Script>
  );
};

export default ComscoreAnalytics;
