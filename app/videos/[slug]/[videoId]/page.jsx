// app/videos/[slug]/[videoId]//page.jsx
export const dynamic = 'force-static';
export const revalidate = 3600;

import PlayerBack from '@/app/components/PlayerBack';
import RelatedVideosCardWrapper from '@/app/components/RelatedVideosCardWrapper';
import InfiniteRelatedVideos from '@/app/components/InfiniteRelatedVideos';
import VideoDetailCard from '@/app/components/VideoDescription';
import { fetchVideoById, fetchRelatedVideos, videoDetailData } from '@/app/lib/FetchData';
import { deslugify, getFormatedData, shortenText } from '@/app/lib/utility';
import { Suspense } from 'react';
import { getBreadcrumbListJsonld, JsonLdWebPage, videoDetailJsonLd } from '@/app/jsonld';
import { GLOBAL_CONFIG } from '@/app/config/config';

import { promises as fs } from 'fs';
import path from 'path';

export async function generateMetadata({ params }) {
  const { videoId, slug } = await params;
  const videoData = await fetchVideoById(videoId);

  if (!videoData) return {};

  const description = shortenText(videoData?.description);
  return {
    title: `${videoData?.title} - Lokmat TV`,
    description:
      description ||
      `Watch ${videoData?.title} on Lokmat TV. Stay updated with latest news and videos from Maharashtra.`,
    // keywords: `${videoData?.title}, ${videoData?.channel}, Lokmat TV, Marathi news, video news, Maharashtra news`,
    keywords: `${
      videoData?.tags.length > 0
        ? videoData?.tags?.join(', ')
        : ' Lokmat TV, Marathi news, video news, Maharashtra news'
    }`,
    metadataBase: new URL(GLOBAL_CONFIG.SITE_PATH),
    alternates: {
      canonical: `/videos/${slug}/${videoId}`,
    },
    openGraph: {
      title: videoData?.title,
      description: description,
      url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/${videoId}`,
      siteName: GLOBAL_CONFIG.OG_SITE_NAME,
      images: [
        {
          url: videoData?.thumbnail_480_url || videoData?.thumbnail_240_url,
          width: 480,
          height: 360,
        },
      ],
      locale: 'mr',
      videos: [
        {
          url: `https://www.dailymotion.com/video/${videoData?.id}`,
        },
      ],
    },
    twitter: {
      card: 'player',
      title: videoData?.title,
      description: description,
      images: [videoData?.thumbnail_480_url || videoData?.thumbnail_240_url],
      player: `https://www.lokmat.com/embed/${videoData?.id}`, // or Dailymotion's embeddable player
      playerWidth: 480,
      playerHeight: 270,
    },
  };
}

const VideoPlayerPage = async ({ params }) => {
  const { videoId, slug } = await params;

  const filePath = path.join(process.cwd(), 'app', 'lib', 'slug_map.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  const jsonData = JSON.parse(fileContents);
  // console.log(jsonData);

  const relatedPlaylist = jsonData.find((item) => item.slug === slug);

  const [videoData, relatedVideos] = await Promise.all([
    fetchVideoById(videoId),
    fetchRelatedVideos(relatedPlaylist?.id, 1),
  ]);

  const breadcrumbJsonld = getBreadcrumbListJsonld([
    { name: 'Videos', url: `${GLOBAL_CONFIG.SITE_PATH}/videos/` },
    { name: relatedPlaylist?.name, url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}` },
    {
      name: videoData?.title,
      url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/${videoId}`,
    },
  ]);

  const videoJsonLd = videoDetailJsonLd({ videoData, relatedVideos, slug, videoId });

  return (
    <>
      <JsonLdWebPage
        url={`${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/${videoId}`}
        name={videoData?.title}
        description={videoData?.description}
        keywords={videoData?.tags}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonld) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoJsonLd),
        }}
      />
      <PlayerBack />
      <div className="detail-wrapper">
        <div className="video-detail-container">
          <div className="video-container">
            <div className="iframe-container">
              <iframe
                className="dm-preview-selector"
                frameBorder="0"
                src={`https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`}
                allowFullScreen
              ></iframe>
            </div>

            <div className="card">
              <div
                className="card-image"
                style={{
                  background: `url('${videoData?.thumbnail_480_url}') center center / cover no-repeat`,
                }}
              ></div>
              <div className="card-content">
                <div className="card-date">{getFormatedData(videoData?.created_time)}</div>
                <div className="card-title">{videoData?.title}</div>
                <div className="card-footer">
                  <span className="card-source">{videoData['owner.screenname']} . </span>
                  <span className="card-category">{videoData?.channel}</span>
                  <i className="arrow-icon play-triangle"></i>
                </div>
              </div>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
              {videoData?.description && <VideoDetailCard data={videoData} />}
            </Suspense>
          </div>
        </div>

        <div className="list-view">
          <div className="player-related-header">{deslugify(slug)}</div>

          {relatedVideos?.list.map((video) => (
            <RelatedVideosCardWrapper
              key={video.id}
              video={video}
              videoId={relatedPlaylist?.id}
              slug={slug}
            />
          ))}

          <InfiniteRelatedVideos videoId={relatedPlaylist?.id} slug={slug} startPage={2} />
        </div>
      </div>
    </>
  );
};

export default VideoPlayerPage;
