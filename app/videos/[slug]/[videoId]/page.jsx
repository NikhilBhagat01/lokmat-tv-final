import React from 'react';

const page = async ({ params }) => {
  const { videoId, slug } = await params;

  const response = await fetch(
    `https://api.dailymotion.com/playlist/${videoId}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=12&page=1`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36',
      },
    }
  );

  const data = await response.json();
  console.log(data);

  return (
    <>
      <div class="expand-header">
        <div class="player-header">
          <span onclick="history.back()" class="player-back"></span>
          <div class="expand-title">{slug} News</div> 
        </div>
      </div>
      <section class="lead-video-container ">
        <section class="video-container">
          <div class="iframe-container lg">
            {' '}
            <iframe
              src={`https://www.dailymotion.com/widget/preview/video/${'x9eo9v4'}?title=none&duration=none&mode=video&trigger=auto`}
              title="Dailymotion Video"
              allowFullScreen
              loading="lazy"
              className=""
            />
          </div>
          <div class="video-details-container">
            <p class="video-title">
              Sharad Ponkshe : बीडमध्ये प्रयोग संपताच शरद पोंक्षेंच्या संतापाचा उद्रेक, कुणाकुणाला
              सुनावलं?
            </p>
            <div class="">
              <a
                href="#"
                class="play-button play-triangle"
                data-player="x9eo9v4"
                data-playlist="x9eo9v4"
              >
                Play
              </a>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default page;
