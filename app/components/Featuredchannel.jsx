import React from 'react';

// Sample data
const Featuredchannels = [
  {
    id: 'x2jo5vs',
    cover_250_url: 'https://s1.dmcdn.net/b/9BMx81eBh9SzWLRLC/x250',
    avatar_60_url: 'https://s1.dmcdn.net/u/9BMx81eBh9SEsjS8M/60x60',
    url: 'https://www.dailymotion.com/LokmatSakhi',
    screenname: 'Lokmat Sakhi',
  },
  {
    id: 'x2jo5vm',
    cover_250_url: 'https://s1.dmcdn.net/b/9BMx21eBjztUOeLE-/x250',
    avatar_60_url: 'https://s1.dmcdn.net/u/9BMx21eBjztwQrM0l/60x60',
    url: 'https://www.dailymotion.com/LokmatBhakti',
    screenname: 'Lokmat Bhakti',
  },
  {
    id: 'x2jo5oz',
    cover_250_url: 'https://s1.dmcdn.net/b/9BMtJ1e0HJF-HSUeW/x250',
    avatar_60_url: 'https://s1.dmcdn.net/u/9BMtJ1e0HJFOApNs1/60x60',
    url: 'https://www.dailymotion.com/LokmatFilmy',
    screenname: 'Lokmat Filmy',
  },
];

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
          <div className="dm-channel-title">Lokmat Sakhi</div>
        </div>
      </div>
    </div>
  );
};

const Featuredchannel = ({ data }) => {
  console.log(data);
  return (
    <section className="lkm-widget channelpro">
      <div className="videos-head">
        <h3 className="head-title">Featured Channels</h3>
      </div>
      <div className="videos-widget card-category-desktop home owl-carousel owl-theme ">
        {Featuredchannels.map((channel) => (
          <FeaturedCard key={channel.id} channel={channel} />
        ))}
      </div>
    </section>
  );
};

export default Featuredchannel;
