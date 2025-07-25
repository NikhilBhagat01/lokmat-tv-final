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
    url: GLOBAL_CONFIG.SITE_PATH,
    logo: {
      '@type': 'ImageObject',
      url: GLOBAL_CONFIG.SITE_LOGO,
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
  url = `${GLOBAL_CONFIG.SITE_PATH}/videos`,
  name = '',
  description = '',
  keywords = '',
}) => {
  // console.log(keywords);
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: url,
    name: name,
    description: cleanVideoDescription(description),
    keywords: Array.isArray(keywords) ? keywords?.join(', ') : keywords,
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
      itemListElement: section?.data?.slice(0, 5).map((video, index) => {
        const base = {
          name: video?.title || video?.name,
          description: cleanVideoDescription(video?.description) || video?.title,
          thumbnailUrl: video?.thumbnail_240_url,
          duration: `PT${Math.floor(video?.duration / 60)}M${video?.duration % 60}S`,
          url: GLOBAL_CONFIG.SITE_PATH + '/videos/' + section?.title_slug + '/' + video?.slug,
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
      itemListElement: section?.videos?.slice(0, 5).map((video, index) => ({
        '@type': 'VideoObject',
        position: index + 1,
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

export const HubPageJsonLd = (data) => {
  const publisher = getPublisher();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data?.name,
    itemListElement: data?.data?.map((video, index) => ({
      '@type': 'VideoObject',
      position: index + 1,
      name: video?.title,
      description: cleanVideoDescription(video?.description) || video?.title,
      thumbnailUrl: video?.thumbnail_240_url,
      duration: `PT${Math.floor(video?.duration / 60)}M${video?.duration % 60}S`,
      url: GLOBAL_CONFIG.SITE_PATH + '/videos/' + data?.slug + '/' + video?.slug,
      embedUrl: `https://www.dailymotion.com/embed/video/${video?.id}`,
      uploadDate: toISTIso8601(video?.created_time),
      publisher,
    })),
  };

  return jsonLd;
};

export const PlaylistJsonLd = (data) => {
  const publisher = getPublisher();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data?.name,
    itemListElement: data?.playlist?.map((section, index) => ({
      '@type': 'ItemList',
      name: section?.playlistName,
      itemListElement: section?.videos?.slice(0, 5).map((video, videoIndex) => ({
        name: video?.title || video?.name,
        '@type': 'VideoObject',
        position: videoIndex + 1,
        description: cleanVideoDescription(video?.description) || video?.title,
        thumbnailUrl: video?.thumbnail_240_url,
        duration: `PT${Math.floor(video?.duration / 60)}M${video?.duration % 60}S`,
        url: GLOBAL_CONFIG.SITE_PATH + '/videos/' + section?.slug + '/' + video?.slug,
        embedUrl: `https://www.dailymotion.com/embed/video/${video?.id}`,
        uploadDate: toISTIso8601(video?.created_time),
        publisher,
      })),
    })),
  };

  return jsonLd;
};

export const videoDetailJsonLd = ({ videoData, relatedVideos, slug, videoId }) => {
  const publisher = getPublisher();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: videoData?.title,
    description: cleanVideoDescription(videoData?.description) || videoData?.title,
    thumbnailUrl: videoData?.thumbnail_240_url,
    duration: `PT${Math.floor(videoData?.duration / 60)}M${videoData?.duration % 60}S`,
    url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/${videoId}`,
    embedUrl: `https://www.dailymotion.com/embed/video/${videoData?.id}`,
    uploadDate: toISTIso8601(videoData?.created_time),
    publisher,
    hasPart: relatedVideos?.list?.map((video, videoIndex) => ({
      '@type': 'VideoObject',
      // position: videoIndex + 1,
      name: video?.title,
      description: cleanVideoDescription(video?.description) || video?.title,
      thumbnailUrl: video?.thumbnail_240_url,
      duration: `PT${Math.floor(video?.duration / 60)}M${video?.duration % 60}S`,
      url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/${video?.slug}`,
      embedUrl: `https://www.dailymotion.com/embed/video/${video?.id}`,
      uploadDate: toISTIso8601(video?.created_time),
      publisher,
    })),
  };

  return jsonLd;
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
        item: {
          '@type': 'WebPage',
          '@id': `${GLOBAL_CONFIG.SITE_PATH}`,
          image: GLOBAL_CONFIG.SITE_LOGO,
        },
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: {
          '@type': 'WebPage',
          '@id': item.url,
          image: GLOBAL_CONFIG.SITE_LOGO,
        },
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
