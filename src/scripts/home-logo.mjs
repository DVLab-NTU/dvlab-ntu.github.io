const logo = document.querySelector('[data-home-logo]');
if (logo) {
  const replay = logo.querySelector('button');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'dvlab-home-logo-seen';
  let ready = false;
  const play = () => {
    if (!ready || motion.matches) return;
    logo.classList.remove('is-playing');
    void logo.offsetWidth;
    logo.classList.add('is-playing');
  };
  const updateMotion = () => {
    replay.hidden = !ready || motion.matches;
    if (motion.matches) logo.classList.remove('is-playing');
  };
  replay.addEventListener('click', play);
  motion.addEventListener('change', updateMotion);
  Promise.all([...logo.querySelectorAll('img')].map(image => image.decode()))
    .then(() => {
      ready = true;
      updateMotion();
      if (motion.matches) return;
      try {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
      } catch {
        return;
      }
      play();
    })
    .catch(() => { /* The static logo and page remain usable if an image fails. */ });
}
