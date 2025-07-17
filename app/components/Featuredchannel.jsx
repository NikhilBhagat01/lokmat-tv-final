import React from 'react';

const FeaturedCard = ({ channel }) => {
  return (
    <div className="card-wraper">
      <div className="cover">
        <div
          className="card-image"
          style={{
            background: `url(${channel?.cover_250_url}) no-repeat center center / cover`,
          }}
        ></div>
        <div className="dm-channel-info-wrapper">
          <div
            className="dm-channel-avatar"
            style={{
              background: `url(${channel?.avatar_60_url}) no-repeat center center / cover`,
            }}
          ></div>
          <div className="dm-channel-title">{channel?.screenname}</div>
        </div>
      </div>
    </div>
  );
};

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
