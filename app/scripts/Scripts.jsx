import Script from 'next/script';

const Jquery = () => {
  return (
    <Script
      src="https://d3pc1xvrcw35tl.cloudfront.net/assets/js/jquery.min-v0.3.js"
      strategy="beforeInteractive"
    />
  );
};

const OwlCarousel = () => {
  return (
    <Script
      src="https://d3pc1xvrcw35tl.cloudfront.net/assets/js/owl.carousel-min-v0.2.js"
      strategy="afterInteractive"
    />
  );
};

const OwlInit = () => {
  return <Script src="/owl-init.js" strategy="afterInteractive" />;
};

export { Jquery, OwlCarousel, OwlInit };
