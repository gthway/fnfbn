import { gsap, ScrollTrigger } from './gsap';

interface Variant {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
}

// Central tuning. Change once, applies everywhere.
const CONFIG = {
  duration: 0.7,
  ease: 'power3.out',
  start: 'top 85%',
  stagger: 0.08,
};

const VARIANTS: Record<string, Variant> = {
  'fade-up':    { from: { opacity: 0, y: 24 },                 to: { opacity: 1, y: 0 } },
  fade:         { from: { opacity: 0 },                        to: { opacity: 1 } },
  'from-left':  { from: { opacity: 0, x: -32 },                to: { opacity: 1, x: 0 } },
  'from-right': { from: { opacity: 0, x: 32 },                 to: { opacity: 1, x: 0 } },
  scale:        { from: { opacity: 0, scale: 0.95 },           to: { opacity: 1, scale: 1 } },
};

function getVariant(name: string | undefined): Variant {
  return VARIANTS[name || 'fade-up'] ?? VARIANTS['fade-up'];
}

function markRevealed(el: Element) {
  (el as HTMLElement).setAttribute('data-revealed', '');
}

function isReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function initReveal() {
  if (typeof window === 'undefined') return;

  // Reduced motion: skip all animations, mark everything revealed
  if (isReducedMotion()) {
    document
      .querySelectorAll('[data-reveal], [data-reveal-group] > *')
      .forEach(markRevealed);
    return;
  }

  // ── Single-element reveals ─────────────────────
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.dataset.revealInit === 'true') return;
    el.dataset.revealInit = 'true';

    const variant = getVariant(el.dataset.reveal);
    const delay = parseFloat(el.dataset.revealDelay || '0') || 0;
    const start = el.dataset.revealStart || CONFIG.start;

    gsap.fromTo(el, variant.from, {
      ...variant.to,
      duration: CONFIG.duration,
      ease: CONFIG.ease,
      delay,
      overwrite: 'auto',
      onStart: () => markRevealed(el),
      scrollTrigger: {
        trigger: el,
        start,
        // restart on every downward entry; nothing happens when scrolling up
        // toggleActions: onEnter, onLeave, onEnterBack, onLeaveBack
        toggleActions: 'restart none none none',
      },
    });
  });

  // ── Group reveals (children stagger via batch) ──
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    if (group.dataset.revealInit === 'true') return;
    group.dataset.revealInit = 'true';

    const children = Array.from(group.children) as HTMLElement[];
    if (children.length === 0) return;

    const variant = getVariant(group.dataset.revealGroup);
    const stagger = parseFloat(group.dataset.revealStagger || `${CONFIG.stagger}`);
    const start = group.dataset.revealStart || CONFIG.start;

    // Apply initial state inline so the start matches our CSS pre-hide
    gsap.set(children, variant.from);

    ScrollTrigger.batch(children, {
      start,
      // fromTo restarts the animation cleanly on every entry from below;
      // scrolling up never hides or rewinds visible elements
      onEnter: (els) => {
        gsap.fromTo(
          els,
          variant.from,
          {
            ...variant.to,
            duration: CONFIG.duration,
            ease: CONFIG.ease,
            stagger,
            overwrite: 'auto',
            onStart() {
              els.forEach(markRevealed);
            },
          },
        );
      },
    });
  });
}
