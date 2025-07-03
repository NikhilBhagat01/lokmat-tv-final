import { Geist, Geist_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';

// import './globals.css';
import './custom.css';

import Navbar from './components/Navbar';
import Script from 'next/script';
import AnalyticsRouteTracker from './components/AnalyticsRouteTracker';
import ComscoreAnalytics from './components/ComscoreAnalytics';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Lokmat TV - Latest News & Videos',
  description:
    'Watch the latest news, entertainment, and trending video content from Lokmat TV. Stay updated with breaking news, exclusive stories, and popular playlists.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              url: 'https://www.lokmat.com/',
              name: 'Latest Marathi News | Live Maharashtra, Mumbai & Pune News | ताज्या मराठी बातम्या लाइव | Marathi Newspaper | Marathi Samachar| Lokmat.com ',
              description:
                ' Lokmat.com: Latest Marathi News Headlines - Lokmat covers Latest Marathi News including Maharashtra, India, Mumbai, Pune & all other cities. Also, Find News on Entertainment, Business, World, Sports and Politics. Get all Live & Breaking headlines and Mumbai & Pune & other Metro Cities. Get ताज्या मराठी बातम्या लाइव at Lokmat.com ',
              keywords:
                ' Latest Marathi News, Marathi news, Mumbai news, Pune news, Maharashtra News, मराठी बातम्या, मराठी बातम्या लाइव, ताज्या मराठी बातम्या,Marathi Newspaper, News in Marathi, latest news in marathi, breaking news in marathi, pune news in marathi, pune news in Marathi ',
              inLanguage: 'mr_IN',
              publisher: { '@type': 'Organization', name: 'Lokmat' },
            }),
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
        <Navbar />
        <main className="  mt-[92px] md:mt-[140px] ">{children}</main>

        <AnalyticsRouteTracker />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID} />
        <ComscoreAnalytics />
        <Script
          src="https://d3pc1xvrcw35tl.cloudfront.net/assets/js/jquery.min-v0.3.js"
          strategy="beforeInteractive"
        />

        <Script
          src="https://d3pc1xvrcw35tl.cloudfront.net/assets/js/owl.carousel-min-v0.2.js"
          strategy="afterInteractive"
        />
        <Script src="/owl-init.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
