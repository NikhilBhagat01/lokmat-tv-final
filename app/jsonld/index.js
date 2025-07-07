import { GLOBAL_CONFIG } from '../config/config';
import { cleanVideoDescription, toISTIso8601 } from '../lib/utility';

export const getPublisher = () => {
  return {
    '@type': 'Organization',
    name: 'Lokmat',
    url: 'https://www.dailymotion.com/lokmatonline',
    logo: {
      '@type': 'ImageObject',
      url: 'https://s2.dmcdn.net/u/2fIYb1b9HAZZ9VCLk/240x240', // Replace with your actual logo URL
      width: 224,
      height: 58,
    },
  };
};

export const JsonLdOrganization = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lokmat',
    url: 'https://www.lokmat.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://d3pc1xvrcw35tl.cloudfront.net/assets/images/lokmat-logo-v0.1.png',
      width: 224,
      height: 58,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1301/2, Lodha Supremus,Dr. E. Moses Rd, Worli Circle, Mumbai',
      addressLocality: 'Mumbai',
      addressRegion: 'India',
      postalCode: '400018',
    },
    sameAs: [
      'https://facebook.com/lokmat',
      'https://twitter.com/milokmat',
      'https://plus.google.com/111681016749225054815',
      'https://www.instagram.com/milokmat/?hl=en',
      'https://www.youtube.com/user/LokmatNews',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export const JsonLdWebPage = ({
  url = 'https://www.lokmat.com/videos',
  name = '',
  description = '',
  keywords = '',
}) => {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: url,
    name: name,
    description: description,
    keywords: keywords,
    inLanguage: 'mr_IN',
    publisher: { '@type': 'Organization', name: 'Lokmat' },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
    />
  );
};

export const getHomePageJsonLd = (data) => {
  const publisher = getPublisher();
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Homepage Video Sections',
    itemListElement: data?.map((section) => ({
      '@type': 'ItemList',
      name: section?.title,
      itemListElement: section?.data?.list?.slice(0, 5).map((video, index) => {
        const base = {
          name: video?.title || video?.name,
          description: cleanVideoDescription(video?.description) || video?.title,
          thumbnailUrl: video?.thumbnail_240_url,
          duration: `PT${Math.floor(video?.duration / 60)}M${video?.duration % 60}S`,
          url:
            GLOBAL_CONFIG.SITE_PATH +
            '/videos/' +
            section?.title_slug +
            '/' +
            section?.id +
            '/' +
            video?.id,
          embedUrl: `https://www.dailymotion.com/embed/video/${video?.id}`,
          uploadDate: toISTIso8601(video?.created_time),
          publisher,
        };

        if (section?.isPlaylist) {
          const { duration, url, embedUrl, uploadDate, publisher, ...rest } = base;
          return {
            '@type': 'ItemList',
            itemListOrder: 'https://schema.org/ItemListUnordered',
            numberOfItems: video?.videos_total || 1,
            itemListElement: [
              {
                '@type': 'VideoObject',
                ...rest,
              },
            ],
          };
        } else {
          return {
            '@type': 'VideoObject',
            position: index + 1,
            ...base,
          };
        }
      }),
    })),
  };

  return jsonld;
};

export const getCategoryPageJsonLd = (data) => {
  const publisher = getPublisher();

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data?.categoryName,
    itemListElement: data?.playlists?.map((section, index) => ({
      '@type': 'ItemList',
      name: section?.playlistName,
      itemListElement: section?.videos?.map((video, index) => ({
        '@type': 'VideoObject',
        name: video?.title,
        description: cleanVideoDescription(video?.description) || video?.title,
        thumbnailUrl: video?.thumbnail_240_url,
        duration: `PT${Math.floor(video?.duration / 60)}M${video?.duration % 60}S`,
        url:
          GLOBAL_CONFIG.SITE_PATH +
          '/videos/' +
          section?.slug +
          '/' +
          section?.id +
          '/' +
          video?.id,
        embedUrl: `https://www.dailymotion.com/embed/video/${video?.id}`,
        uploadDate: toISTIso8601(video?.created_time),
        publisher,
      })),
    })),
  };

  return jsonld;
};

export const getBreadcrumbListJsonld = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.lokmat.com/',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2, // +2 because Home is position 1
        name: item.name,
        item: item.url,
      })),
    ],
  };
};

export const SiteNavigationJsonld = () => {
  const siteNavigation = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: GLOBAL_CONFIG.SITE_NAVIGATION.name,
    url: GLOBAL_CONFIG.SITE_NAVIGATION.url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigation) }}
    />
  );
};
