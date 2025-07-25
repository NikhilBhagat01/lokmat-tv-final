// app/videos/[slug]/[videoId]/[playerId]/page.jsx
export const dynamic = 'force-static';
export const revalidate = 180;

import PlayerBack from '@/app/components/PlayerBack';
import RelatedVideosCardWrapper from '@/app/components/RelatedVideosCardWrapper';
import InfiniteRelatedVideos from '@/app/components/InfiniteRelatedVideos';
import VideoDetailCard from '@/app/components/VideoDescription';
import { fetchVideoById, fetchRelatedVideos } from '@/app/lib/FetchData';
import { deslugify, getFormatedData, shortenText } from '@/app/lib/utility';
import { Suspense } from 'react';
import { getBreadcrumbListJsonld, JsonLdWebPage, videoDetailJsonLd } from '@/app/jsonld';
import { GLOBAL_CONFIG } from '@/app/config/config';

export async function generateMetadata({ params }) {
  const { videoId, slug, playerId } = await params;
  const videoData = await fetchVideoById(playerId);

  // console.log(videoData);
  if (!videoData) return {};

  const description = shortenText(videoData?.description);

  return {
    title: `${videoData?.title} - Lokmat TV`,
    description:
      description ||
      `Watch ${videoData?.title} on Lokmat TV. Stay updated with latest news and videos from Maharashtra.`,
    keywords: `${videoData?.title}, ${videoData?.channel}, Lokmat TV, Marathi news, video news, Maharashtra news`,
    metadataBase: new URL(GLOBAL_CONFIG.SITE_PATH),
    alternates: {
      canonical: `/videos/${slug}/${videoId}/${playerId}`,
    },
    openGraph: {
      title: videoData?.title,
      description: description,
      url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/${videoId}/${playerId}`,
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
    },
  };
}

const VideoPlayerPage = async ({ params }) => {
  const { videoId, playerId, slug } = await params;

  const [videoData, relatedVideos] = await Promise.all([
    fetchVideoById(playerId),
    fetchRelatedVideos(videoId, 1),
  ]);

  const breadcrumbJsonld = getBreadcrumbListJsonld([
    { name: 'Videos', url: `${GLOBAL_CONFIG.SITE_PATH}/videos/` },
    { name: deslugify(slug), url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/${videoId}` },
    {
      name: videoData?.title,
      url: `${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/${videoId}/${playerId}`,
    },
  ]);

  const videoJsonLd = videoDetailJsonLd({ videoData, relatedVideos, slug, videoId, playerId });

  return (
    <>
      <JsonLdWebPage
        url={`${GLOBAL_CONFIG.SITE_PATH}/videos/${slug}/${videoId}/${playerId}`}
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
                src={`https://www.dailymotion.com/embed/video/${playerId}?autoplay=1&mute=0`}
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
            <RelatedVideosCardWrapper key={video.id} video={video} videoId={videoId} slug={slug} />
          ))}

          <InfiniteRelatedVideos videoId={videoId} slug={slug} startPage={2} />
        </div>
      </div>
    </>
  );
};

export default VideoPlayerPage;
