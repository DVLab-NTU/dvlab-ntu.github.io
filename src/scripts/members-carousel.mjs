function initMembersCarousel() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  for (const track of document.querySelectorAll('[data-members-track-scroll]')) {
    if (track.dataset.carouselInit === '1') continue;
    track.dataset.carouselInit = '1';

    let direction = 1;
    let paused = false;
    const parent = track.closest('[data-members-track]');
    parent?.addEventListener('mouseenter', () => { paused = true; });
    parent?.addEventListener('mouseleave', () => { paused = false; });
    parent?.addEventListener('focusin', () => { paused = true; });
    parent?.addEventListener('focusout', () => { paused = false; });

    const step = () => {
      if (!paused && track.scrollWidth > track.clientWidth + 4) {
        track.scrollLeft += direction * 0.75;
        const max = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= max - 2) direction = -1;
        if (track.scrollLeft <= 2) direction = 1;
      }
      window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }
}

initMembersCarousel();
document.addEventListener('astro:page-load', initMembersCarousel);
