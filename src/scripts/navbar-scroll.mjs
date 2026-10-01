let cleanupNavbarScroll = null;

function initNavbarScroll() {
  cleanupNavbarScroll?.();

  const header = document.querySelector('.site-header');
  if (!header) {
    cleanupNavbarScroll = null;
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const syncOffset = () => {
    const height = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--site-header-height', `${height}px`);
  };

  const sync = () => {
    syncOffset();
    const scrolled = window.scrollY > 8;
    header.classList.toggle('is-scrolled', scrolled);
  };

  sync();
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', syncOffset, { passive: true });

  const nav = header.querySelector('.nav');
  const observer = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(syncOffset)
    : null;
  observer?.observe(header);
  if (nav && nav !== header) observer?.observe(nav);

  if (nav) {
    nav.addEventListener('transitionend', syncOffset);
    const menuObserver = new MutationObserver(syncOffset);
    menuObserver.observe(nav, { attributes: true, attributeFilter: ['class'] });
    cleanupNavbarScroll = () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', syncOffset);
      observer?.disconnect();
      menuObserver.disconnect();
    };
  } else {
    cleanupNavbarScroll = () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', syncOffset);
      observer?.disconnect();
    };
  }

  if (reduceMotion) {
    header.style.transitionDuration = '1ms';
  }

}

initNavbarScroll();
document.addEventListener('astro:page-load', initNavbarScroll);
