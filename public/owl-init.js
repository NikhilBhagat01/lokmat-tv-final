(function () {
  function initCarousel() {
    if (window.innerWidth < 768) {
      return;
    }

    if (typeof window.$ !== 'function' || typeof window.$.fn.owlCarousel !== 'function') {
      console.warn('jQuery or Owl Carousel not loaded yet');
      return;
    }

    const $el = $('.owl-carousel');

    if (!$el.length) return;

    if ($el.hasClass('owl-loaded')) {
      $el.trigger('destroy.owl.carousel');
    }

    setTimeout(() => {
      $el.owlCarousel({
        loop: false,
        margin: 16,
        nav: true,
        dots: true,
        responsive: {
          0: { items: 1.5 },
          768: { items: 3.5 },
          1024: { items: 5.1 },
        },
      });
    }, 100);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initCarousel();
  } else {
    document.addEventListener('DOMContentLoaded', initCarousel);
  }

  // Optional: re-run on route change (for SPA nav)
  window.addEventListener('popstate', initCarousel);
})();
