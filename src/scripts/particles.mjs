// Home hero constellations: slow-drifting stars that link into constellation lines
// when they pass close to each other. The pointer acts as one more star, so moving
// across the sky draws lines to nearby stars; a click adds a small cluster.
// Decorative only — content never depends on it.
let cleanup = null;

const LINK_DISTANCE = 140;
const POINTER_DISTANCE = 190;

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
  const density = 11000;
  const count = Math.max(14, Math.min(84, Math.floor((canvas.clientWidth * canvas.clientHeight) / density * reduceFactor)));
  let color;
  let linkColor;
  let linkOpacity;
  function updateColor() {
    const style = getComputedStyle(document.documentElement);
    color = style.getPropertyValue('--particle-color').trim() || '#f4f7ff';
    linkColor = style.getPropertyValue('--particle-link-color').trim() || color;
    linkOpacity = Number.parseFloat(style.getPropertyValue('--particle-link-opacity')) || 0.2;
  }
  updateColor();

  const makeStar = (x, y, speed = 0.18) => ({
    x,
    y,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    size: 0.6 + Math.random() ** 2 * 1.6,
    phase: Math.random() * Math.PI * 2,
    rate: 0.6 + Math.random() * 1.4,
  });

  const particles = Array.from({ length: count }, () => makeStar(Math.random() * canvas.clientWidth, Math.random() * canvas.clientHeight));

  let width = canvas.clientWidth;
  let height = canvas.clientHeight;
  const mouse = { x: -9999, y: -9999 };
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

  function line(ax, ay, bx, by, alpha) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  function step(time) {
    const elapsed = lastTime ? Math.min((time - lastTime) / (1000 / 60), 2) : 1;
    lastTime = time;
    const seconds = time / 1000;
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx * elapsed;
      p.y += p.vy * elapsed;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Stars ease away from the pointer just enough to keep lines readable.
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 70 && dist > 0) {
        const force = (70 - dist) / 70;
        p.x += (dx / dist) * force * 1.2 * elapsed;
        p.y += (dy / dist) * force * 1.2 * elapsed;
      }
      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));
    }

    ctx.strokeStyle = linkColor;
    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j += 1) {
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DISTANCE) line(a.x, a.y, b.x, b.y, linkOpacity * (1 - d / LINK_DISTANCE));
      }
      const pd = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (pd < POINTER_DISTANCE) line(a.x, a.y, mouse.x, mouse.y, Math.min(1, linkOpacity * 2.2) * (1 - pd / POINTER_DISTANCE));
    }

    ctx.fillStyle = color;
    for (const p of particles) {
      ctx.globalAlpha = 0.45 + 0.45 * (0.5 + 0.5 * Math.sin(seconds * p.rate + p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
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
    for (let i = 0; i < 4 && particles.length < 110; i += 1) {
      particles.push(makeStar(event.clientX - rect.left, event.clientY - rect.top, 0.9));
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
