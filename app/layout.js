import { Geist, Geist_Mono } from 'next/font/google';
import './custom.css';

import Navbar from './components/Navbar';

import AnalyticsRouteTracker from './Ads/AnalyticsRouteTracker';
import ComscoreAnalytics from './Ads/ComscoreAnalytics';
import GoogleAnalytics from './Ads/GoogleAnalytics';

import JsonLdOrganization from './jsonld/JsonLdOrganization';
import JsonLdWebPage from './jsonld/JsonLdWebPage';

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <JsonLdWebPage />
        <JsonLdOrganization />
        <GoogleAnalytics />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
        <Navbar />
        <main className="  mt-[92px] md:mt-[140px] ">{children}</main>
        <AnalyticsRouteTracker />
        <ComscoreAnalytics />
        <Jquery />
        <OwlCarousel />
        <OwlInit />
      </body>
    </html>
  );
}
