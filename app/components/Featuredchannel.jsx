import React from 'react';
import FeaturedCard from './FeaturedCard';

const Featuredchannel = ({ data }) => {
  // console.log(data.data.list);
  return (
    <section className="lkm-widget channelpro">
      <div className="videos-head">
        <h3 className="head-title">Featured Channels</h3>
      </div>
      <div className="videos-widget card-category-desktop home owl-carousel owl-theme ">
        {data?.data?.map((channel) => (
          <FeaturedCard key={channel.id} channel={channel} />
        ))}
      </div>
    </section>
  );
};

export default Featuredchannel;
