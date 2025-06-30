(function () {
  function isDesktop() {
    return typeof window !== 'undefined' && window.innerWidth >= 768;
  }

  function initOwl() {
    if (!isDesktop()) return;

    if (!window.$ || typeof window.$.fn.owlCarousel !== 'function') {
      console.warn('Owl Carousel or jQuery not loaded');
      return;
    }

    const $carousels = window.$('.owl-carousel');

    if (!$carousels.length) return;

    $carousels.each(function () {
      const $el = window.$(this);

      // Prevent double init
      if ($el.hasClass('owl-loaded')) {
        $el.trigger('destroy.owl.carousel');
        $el.removeClass('owl-loaded owl-theme');
        $el.find('.owl-stage-outer').children().unwrap();
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
    });
  }

  // Run on first load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initOwl, 200);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initOwl, 200);
    });
  }

  // Monkey patch Next.js routing (for push/replaceState)
  (function () {
    const push = history.pushState;
    const replace = history.replaceState;

    history.pushState = function () {
      push.apply(history, arguments);
      setTimeout(initOwl, 400);
    };

    history.replaceState = function () {
      replace.apply(history, arguments);
      setTimeout(initOwl, 400);
    };

    window.addEventListener('popstate', () => {
      setTimeout(initOwl, 400);
    });
  })();

  // Mutation observer for when Next.js renders new content
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const added = [...mutation.addedNodes];
        const hasCarousel = added.some((node) => node?.querySelector?.('.owl-carousel'));
        if (hasCarousel) {
          setTimeout(initOwl, 300);
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
