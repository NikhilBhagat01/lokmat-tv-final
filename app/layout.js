import { Geist, Geist_Mono } from 'next/font/google';
import './custom.css';

import Navbar from './components/Navbar';

import AnalyticsRouteTracker from './Ads/AnalyticsRouteTracker';
import ComscoreAnalytics from './Ads/ComscoreAnalytics';
import GoogleAnalytics from './Ads/GoogleAnalytics';

import { JsonLdOrganization, SiteNavigationJsonld } from './jsonld';

import { Jquery, OwlCarousel, OwlInit } from './scripts/Scripts';

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
  robots: 'max-image-preview:large',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="lokmat-section" content="Videos" />
        <meta property="og:see_also" content="https://www.lokmat.com/" />
        <meta property="fb:app_id" content="1578519998827621" />
        <meta property="fb:pages" content="132309676835568" />
        <meta name="twitter:app:id:googleplay" content="com.lokmat.app" />
        <meta name="twitter:app:id:iphone" content="843699873" />
        <meta name="twitter:app:id:ipad" content="843699873" />
        <meta name="twitter:app:name:googleplay" content="Lokmat Marathi News - Official" />
        <meta name="twitter:app:name:iphone" content="Lokmat Newspaper" />
        <meta name="twitter:app:name:ipad" content="Lokmat Newspaper" />

        {process.env.NODE_ENV === 'production' ? <GoogleAnalytics /> : null}
        {process.env.NODE_ENV === 'production' ? <ComscoreAnalytics /> : null}
        <JsonLdOrganization />
        <SiteNavigationJsonld />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
        <Navbar />
        <main className="  mt-[92px] md:mt-[140px] ">{children}</main>
        {process.env.NODE_ENV === 'production' ? <AnalyticsRouteTracker /> : null}
        <Jquery />
        <OwlCarousel />
        <OwlInit />
      </body>
    </html>
  );
}
