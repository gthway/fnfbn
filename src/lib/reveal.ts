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
  // Behavior:
  //   - Animate on downward entry from below
  //   - No reset / reverse while scrolling up (element stays visible)
  //   - "Arm" again only after element has fully exited the viewport via
  //     the bottom (user scrolled all the way back above the element).
  //   - Re-armed element animates fresh on next downward entry. No flash.
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.dataset.revealInit === 'true') return;
    el.dataset.revealInit = 'true';

    const variant = getVariant(el.dataset.reveal);
    const delay = parseFloat(el.dataset.revealDelay || '0') || 0;
    const start = el.dataset.revealStart || CONFIG.start;

    let armed = true;

    const play = () => {
      if (!armed) return;
      armed = false;
      gsap.fromTo(el, variant.from, {
        ...variant.to,
        duration: CONFIG.duration,
        ease: CONFIG.ease,
        delay,
        overwrite: 'auto',
        onStart: () => markRevealed(el),
      });
    };

    // Play trigger
    ScrollTrigger.create({
      trigger: el,
      start,
      onEnter: play,
    });

    // Re-arm trigger: fires only when element is fully below viewport again
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      onLeaveBack: () => {
        armed = true;
        gsap.killTweensOf(el);
        gsap.set(el, variant.from);
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

    gsap.set(children, variant.from);
    const armed = new Set<HTMLElement>(children);

    ScrollTrigger.batch(children, {
      start,
      onEnter: (els) => {
        const toPlay = (els as HTMLElement[]).filter((el) => armed.has(el));
        if (toPlay.length === 0) return;
        toPlay.forEach((el) => armed.delete(el));
        gsap.fromTo(
          toPlay,
          variant.from,
          {
            ...variant.to,
            duration: CONFIG.duration,
            ease: CONFIG.ease,
            stagger,
            overwrite: 'auto',
            onStart() {
              toPlay.forEach(markRevealed);
            },
          },
        );
      },
    });

    children.forEach((child) => {
      ScrollTrigger.create({
        trigger: child,
        start: 'top bottom',
        onLeaveBack: () => {
          armed.add(child);
          gsap.killTweensOf(child);
          gsap.set(child, variant.from);
        },
      });
    });
  });
}
