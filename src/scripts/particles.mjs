// Old-site style particle background (lightweight vanilla canvas port of the
// 2022 react-tsparticles setup: square particles, link lines, hover repulse,
// click push). Decorative only — content never depends on it.
let cleanup = null;

function initParticles() {
  cleanup?.();
  cleanup = null;

  const canvas = document.querySelector('[data-particles]');
  if (!canvas || !canvas.getContext) {
    return;
  }

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const container = canvas.parentElement;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduceFactor = window.innerWidth < 760 ? 0.5 : 1;
  const density = 10000;
  const count = Math.max(12, Math.min(80, Math.floor((canvas.clientWidth * canvas.clientHeight) / density * reduceFactor)));
  let color;
  function updateColor() {
    color = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim() || 'rgba(252, 255, 204, 0.55)';
  }
  updateColor();

  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.clientWidth,
    y: Math.random() * canvas.clientHeight,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: 1.5 + Math.random() * 2.5,
    opacity: 0.3 + Math.random() * 0.4,
  }));

  let width = canvas.clientWidth;
  let height = canvas.clientHeight;
  let mouse = { x: -9999, y: -9999 };
  let raf = 0;
  let visible = false;
  let lastTime = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function step(time) {
    const elapsed = lastTime ? Math.min((time - lastTime) / (1000 / 60), 2) : 1;
    lastTime = time;
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx * elapsed;
      p.y += p.vy * elapsed;

      if (p.x < 0 || p.x > width) {
        p.vx *= -1;
      }
      if (p.y < 0 || p.y > height) {
        p.vy *= -1;
      }

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120 && dist > 0) {
        const force = (120 - dist) / 120;
        p.x += (dx / dist) * force * 2 * elapsed;
        p.y += (dy / dist) * force * 2 * elapsed;
      }
    }

    for (const p of particles) {
      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));
    }
    ctx.fillStyle = color;
    for (const p of particles) {
      ctx.globalAlpha = p.opacity;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }

    ctx.globalAlpha = 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    // ponytail: pairwise links capped at 100 particles; use a spatial grid if this cap grows.
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 150) {
          ctx.globalAlpha = 0.1 * (1 - d / 150);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    raf = requestAnimationFrame(step);
  }

  function onMove(event) {
    if (event.pointerType !== 'mouse') return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  }

  function onLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  function onClick(event) {
    if (motion.matches || event.pointerType !== 'mouse' || event.target.closest('a, button, input, select, textarea, [role=button]')) return;
    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < 4 && particles.length < 100; i += 1) {
      particles.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }
  }

  function syncAnimation() {
    cancelAnimationFrame(raf);
    raf = 0;
    lastTime = 0;
    onLeave();
    canvas.hidden = motion.matches;
    if (!motion.matches) resize();
    if (visible && !document.hidden && !motion.matches) raf = requestAnimationFrame(step);
  }

  const viewport = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncAnimation();
  });
  const theme = new MutationObserver(updateColor);
  const size = new ResizeObserver(resize);
  viewport.observe(container);
  size.observe(container);
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  motion.addEventListener('change', syncAnimation);
  document.addEventListener('visibilitychange', syncAnimation);
  container.addEventListener('pointermove', onMove, { passive: true });
  container.addEventListener('pointerleave', onLeave);
  container.addEventListener('click', onClick);

  resize();
  syncAnimation();
  cleanup = () => {
    cancelAnimationFrame(raf);
    viewport.disconnect();
    theme.disconnect();
    size.disconnect();
    motion.removeEventListener('change', syncAnimation);
    document.removeEventListener('visibilitychange', syncAnimation);
    container.removeEventListener('pointermove', onMove);
    container.removeEventListener('pointerleave', onLeave);
    container.removeEventListener('click', onClick);
  };
}

initParticles();
window.addEventListener('pagehide', () => cleanup?.());
window.addEventListener('pageshow', event => { if (event.persisted) initParticles(); });
