import PlayerBack from '@/app/components/PlayerBack';
import VideoDetailCard from '@/app/components/VideoDescription';
import { fetchVideoById, fetchRelatedVideos } from '@/app/lib/FetchData';
import { getFormatedData } from '@/app/lib/utility';
import { Suspense } from 'react';

// export async function generateMetadata({ params }) {
//   const { videoId, slug, playerId } = params;
//   const videoData = await fetchVideoById(playerId);

//   if (!videoData) return {};

//   return {
//     title: `${videoData.title} - Lokmat TV`,
//     description: videoData.description || `Watch ${videoData.title} on Lokmat TV. Stay updated with latest news and videos from Maharashtra.`,
//     keywords: `${videoData.title}, ${videoData.channel}, Lokmat TV, Marathi news, video news, Maharashtra news`,
//     metadataBase: new URL('https://www.lokmat.com'),
//     alternates: {
//       canonical: `/videos/${slug}/${videoId}/${playerId}`,
//     },
//     openGraph: {
//       title: videoData.title,
//       description: videoData.description,
//       url: `https://www.lokmat.com/videos/${slug}/${videoId}/${playerId}`,
//       siteName: 'LokmatTV',
//       images: [
//         {
//           url: videoData.thumbnail_480_url || videoData.thumbnail_240_url,
//           width: 480,
//           height: 360,
//         },
//       ],
//       locale: 'mr_IN',
//       type: 'video.other',
//       videos: [
//         {
//           url: `https://www.dailymotion.com/video/${videoData.id}`,
//         },
//       ],
//     },
//     twitter: {
//       card: 'player',
//       title: videoData.title,
//       description: videoData.description,
//       images: [videoData.thumbnail_480_url || videoData.thumbnail_240_url],
//       players: [
//         {
//           url: `https://www.dailymotion.com/embed/video/${videoData.id}`,
//           width: 480,
//           height: 360,
//         },
//       ],
//     },
//   };
// }

const VideoPlayerPage = async ({ params }) => {
  const { videoId, playerId, slug } = await params;

  const deslugify = (slug) => {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/(\d+)/g, ' $1')
      .trim();
  };

  const page_slug = deslugify(slug);

  // Fetch initial data
  const [videoData, relatedVideos] = await Promise.all([
    fetchVideoById(playerId),
    fetchRelatedVideos(videoId, 1),
  ]);

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(videoData.created_time * 1000));
  console.log(relatedVideos);

  return (
    <>
      <PlayerBack />
      <div className="detail-wrapper">
        <div className="video-detail-container">
          <div className="video-container">
            <div className="iframe-container">
              <iframe
                className="dm-preview-selector"
                frameBorder="0"
                src={`https://www.dailymotion.com/embed/video/${playerId}?autoplay=1`}
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
                <div className="card-date">{formattedDate}</div>
                <div className="card-title">{videoData?.title}</div>
                <div className="card-footer">
                  <span className="card-source">{videoData['owner.screenname']}</span>
                  <span className="card-category">{videoData?.channel}</span>
                  <i className="arrow-icon play-triangle"></i>
                </div>
              </div>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
              <VideoDetailCard description={videoData.description} />
            </Suspense>
          </div>

          {/* below card start */}

          <div className="list-view">
            <div className="player-related-header">{page_slug}</div>

            {relatedVideos?.list.map((video) => (
              <div className="card-wraper">
                <div className="card gotovideoDetail">
                  <div className="card-image imgwrap">
                    <img
                      className="lazy-img"
                      src={video.thumbnail_240_url}
                      alt={video.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="card-content">
                    <div className="card-date">{getFormatedData(video?.created_time)}</div>
                    <div className="card-title">{video.title}</div>
                    <div className="card-footer">
                      <span className="card-source">{video['owner.screenname']}</span>
                      <span className="card-category">{video.channel}</span>
                      <i className="arrow-icon play-triangle">
                        <span>
                          {Math.floor(video?.duration / 60)}:
                          {(video?.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* below card end */}
        </div>
      </div>
    </>
  );
};

export default VideoPlayerPage;
