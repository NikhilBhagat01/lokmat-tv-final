// (function () {
//   function isDesktop() {
//     return typeof window !== 'undefined' && window.innerWidth >= 768;
//   }

//   function initOwlCarousels() {
//     if (!isDesktop()) return;

//     if (!window.$ || !window.$.fn?.owlCarousel) {
//       console.warn('Owl Carousel not available');
//       return;
//     }

//     const $carousels = $('.owl-carousel');

//     if (!$carousels.length) return;

//     $carousels.each(function () {
//       const $this = $(this);

//       if ($this.hasClass('owl-loaded')) {
//         $this.trigger('destroy.owl.carousel');
//         $this.removeClass('owl-loaded owl-theme');
//         $this.find('.owl-stage-outer').children().unwrap();
//       }

//       $this.owlCarousel({
//         loop: false,
//         margin: 16,
//         nav: true,
//         dots: true,
//         responsive: {
//           0: { items: 1.5 },
//           768: { items: 3.5 },
//           1024: { items: 5.1 },
//         },
//       });
//     });
//   }

//   // Run initially
//   document.addEventListener('DOMContentLoaded', initOwlCarousels);

//   // Re-run on DOM changes (due to Next.js client-side routing)
//   const observer = new MutationObserver(() => {
//     initOwlCarousels();
//   });

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true,
//   });

//   // Re-init on resize (in case desktop/mobile view switches)
//   window.addEventListener('resize', () => {
//     if (isDesktop()) {
//       initOwlCarousels();
//     }
//   });
// })();

// old function
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
