export const dynamic = 'force-static';
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import NewsLayout from './components/NewsLayout';
import PlaylistCarousel from './components/PlaylistCarousel';
import { fetchAllDailymotionData } from './lib/FetchData';
import React from 'react';
import Adbox from './components/Adbox';
import VideoCarousel from './components/VideoCarousel';

export default async function Home() {
  const data = await fetchAllDailymotionData();

  // console.log(data);

  const topStories = data[0]?.data?.list || [];
  const topStoriesTitle = data[0]?.title;
  const topStoriesSlug = data[0]?.title_slug;
  const topStoriesId = data[0]?.id;
  return (
    <div className="video-wrapper">
      <NewsLayout
        data={topStories}
        title={topStoriesTitle}
        slug={topStoriesSlug}
        id={topStoriesId}
      />
      {data?.slice(1).map((item, index) => (
        <React.Fragment key={index}>
          {/* {index % 2 === 0 && <Adbox key={`ad-${index}`} width="800px" height="100px" />} */}
          {item?.isFeaturedChannel ? (
            <></>
          ) : // <Featuredchannel data={item} />
          item?.isPlaylist ? (
            <PlaylistCarousel data={item} />
          ) : (
            <VideoCarousel
              title={item?.title}
              slug={item?.title_slug}
              data={item?.data?.list || []}
              id={item?.id}
            />
          )}
        </React.Fragment>
      ))}
      {/* <PlaylistCarousel /> */}
    </div>
  );
}
