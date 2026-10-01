/** CRA About lab-culture typewriter (typewriter-effect options: delay 20, deleteSpeed 30, cursor _). */

const TYPE_DELAY_MS = 20;
const DELETE_DELAY_MS = 30;
const PAUSE_TYPED_MS = 2000;
const PAUSE_DELETED_MS = 400;
const REDUCED_ROTATE_MS = 5000;

function parseStrings(root) {
  try {
    const raw = root.dataset.strings;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string' && s.length > 0) : [];
  } catch {
    return [];
  }
}

function runTypewriter(display, strings) {
  let stringIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let cancelled = false;

  const schedule = (fn, ms) => {
    const id = window.setTimeout(fn, ms);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  };

  const step = () => {
    if (cancelled) return;
    const current = strings[stringIndex];
    if (!deleting) {
      charIndex += 1;
      display.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        schedule(() => {
          deleting = true;
          step();
        }, PAUSE_TYPED_MS);
        return;
      }
      schedule(step, TYPE_DELAY_MS);
      return;
    }

    charIndex -= 1;
    display.textContent = current.slice(0, charIndex);
    if (charIndex <= 0) {
      deleting = false;
      stringIndex = (stringIndex + 1) % strings.length;
      schedule(step, PAUSE_DELETED_MS);
      return;
    }
    schedule(step, DELETE_DELAY_MS);
  };

  step();
  return () => {
    cancelled = true;
  };
}

function runReducedCycle(display, strings) {
  let index = 0;
  display.textContent = strings[0];
  if (strings.length <= 1) return () => {};

  const id = window.setInterval(() => {
    index = (index + 1) % strings.length;
    display.textContent = strings[index];
  }, REDUCED_ROTATE_MS);

  return () => window.clearInterval(id);
}

export function initHomeCultureTypewriter(root) {
  if (!(root instanceof HTMLElement)) return () => {};
  const strings = parseStrings(root);
  const display = root.querySelector('[data-typewriter-display]');
  if (!display || strings.length === 0) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.toggle('is-reduced-motion', reduced);

  if (reduced) {
    return runReducedCycle(display, strings);
  }

  return runTypewriter(display, strings);
}

export function initHomeCultureTypewriters() {
  const roots = document.querySelectorAll('[data-culture-typewriter]');
  const cleanups = [];
  for (const root of roots) {
    cleanups.push(initHomeCultureTypewriter(root));
  }
  return () => cleanups.forEach((fn) => fn());
}

initHomeCultureTypewriters();
