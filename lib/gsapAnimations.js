/**
 * WHOLESOME GSAP ANIMATION SYSTEM
 *
 * Delightful, joy-sparking animations for Food Xpiry
 * Built on GSAP for smooth, physics-based motion
 */

import { gsap } from 'gsap';

// ==================== EASING PRESETS ====================

export const easings = {
  // Bouncy, playful
  bounce: 'elastic.out(1, 0.3)',
  bounceSoft: 'elastic.out(1, 0.5)',
  bounceSubtle: 'elastic.out(1, 0.7)',

  // Smooth, organic
  smooth: 'power2.out',
  smoothIn: 'power2.in',
  smoothInOut: 'power2.inOut',

  // Snappy, magnetic
  snap: 'back.out(1.7)',
  snapIn: 'back.in(1.7)',

  // Natural, gravity-like
  natural: 'power3.out',

  // Gentle, relaxed
  gentle: 'sine.out',
  gentleInOut: 'sine.inOut',
};

// ==================== MAGNET ANIMATIONS ====================

/**
 * Makes magnets wobble playfully on page load
 */
export function animateMagnetsEntrance(magnets, options = {}) {
  const { delay = 0.2, stagger = 0.1 } = options;

  // First ensure magnets are visible
  gsap.set(magnets, { scale: 1, rotation: 0, y: 0, opacity: 1 });

  // Then do a playful bounce animation
  return gsap.fromTo(magnets,
    {
      scale: 0.5,
      rotation: -20,
    },
    {
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: easings.bounce,
      stagger: {
        each: stagger,
        from: 'random',
      },
      delay,
    }
  );
}

/**
 * Subtle floating wobble for ambient delight
 */
export function createMagnetFloat(magnet) {
  return gsap.to(magnet, {
    y: '+=3',
    rotation: '+=2',
    duration: 2 + Math.random(),
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

/**
 * Magnet "snap" effect on hover
 */
export function magnetHoverEffect(magnet) {
  const tl = gsap.timeline({ paused: true });

  tl.to(magnet, {
    scale: 1.2,
    rotation: 15,
    duration: 0.3,
    ease: easings.snap,
  })
  .to(magnet, {
    scale: 1.1,
    rotation: 0,
    duration: 0.2,
    ease: easings.bounce,
  });

  return tl;
}

// ==================== STICKY NOTE ANIMATIONS ====================

/**
 * Sticky note cascade entrance - like notes falling onto fridge
 */
export function animateStickyNotesEntrance(notes, options = {}) {
  const { delay = 0.3, stagger = 0.08 } = options;

  return gsap.fromTo(notes,
    {
      opacity: 0,
      y: -100,
      rotation: () => gsap.utils.random(-15, 15),
      scale: 0.8,
    },
    {
      opacity: 1,
      y: 0,
      rotation: () => gsap.utils.random(-3, 3),
      scale: 1,
      duration: 0.7,
      ease: easings.bounceSubtle,
      stagger: {
        each: stagger,
        from: 'start',
      },
      delay,
    }
  );
}

/**
 * Gentle floating for sticky notes (ambient)
 */
export function createStickyNoteFloat(note, index = 0) {
  const duration = 3 + (index % 3) * 0.5;
  const yAmount = 2 + (index % 2);
  const rotAmount = 0.5 + (index % 3) * 0.3;

  return gsap.to(note, {
    y: `+=${yAmount}`,
    rotation: `+=${rotAmount}`,
    duration,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: index * 0.2,
  });
}

/**
 * Sticky note lift on hover
 */
export function stickyNoteHoverIn(note) {
  return gsap.to(note, {
    y: -12,
    rotation: 1,
    scale: 1.03,
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    duration: 0.3,
    ease: easings.snap,
  });
}

export function stickyNoteHoverOut(note) {
  return gsap.to(note, {
    y: 0,
    rotation: 0,
    scale: 1,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    duration: 0.4,
    ease: easings.gentle,
  });
}

// ==================== FEATURE BADGE ANIMATIONS ====================

/**
 * Feature badges cascade in with delightful stagger
 */
export function animateFeatureBadges(badges, options = {}) {
  const { delay = 0.6, stagger = 0.12 } = options;

  // Ensure badges are visible first
  gsap.set(badges, { opacity: 1, scale: 1 });

  return gsap.fromTo(badges,
    {
      y: 20,
      scale: 0.9,
    },
    {
      y: 0,
      scale: 1,
      rotation: () => gsap.utils.random(-2, 2),
      duration: 0.5,
      ease: easings.bounceSoft,
      stagger: {
        each: stagger,
        from: 'center',
      },
      delay,
    }
  );
}

/**
 * Feature badge hover - playful lift
 */
export function featureBadgeHoverIn(badge) {
  return gsap.to(badge, {
    y: -8,
    scale: 1.1,
    rotation: 0,
    duration: 0.25,
    ease: easings.snap,
  });
}

export function featureBadgeHoverOut(badge) {
  return gsap.to(badge, {
    y: 0,
    scale: 1,
    rotation: () => gsap.utils.random(-2, 2),
    duration: 0.3,
    ease: easings.gentle,
  });
}

// ==================== FRIDGE DOOR ANIMATIONS ====================

/**
 * Enhanced fridge door open animation
 */
export function animateFridgeDoorOpen(door, options = {}) {
  const { onComplete } = options;

  return gsap.to(door, {
    rotateY: -45,
    duration: 0.6,
    ease: 'power2.out',
    onComplete,
  });
}

/**
 * Fridge handle pulse - draws attention
 */
export function pulseHandle(handle) {
  return gsap.to(handle, {
    scale: 1.05,
    duration: 1,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

/**
 * Handle hover glow effect
 */
export function handleHoverIn(handle) {
  return gsap.to(handle, {
    scale: 1.1,
    filter: 'brightness(1.2)',
    duration: 0.2,
    ease: easings.snap,
  });
}

export function handleHoverOut(handle) {
  return gsap.to(handle, {
    scale: 1,
    filter: 'brightness(1)',
    duration: 0.3,
    ease: easings.gentle,
  });
}

// ==================== BUTTON ANIMATIONS ====================

/**
 * Playful button press
 */
export function buttonPress(button) {
  return gsap.to(button, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.in',
    yoyo: true,
    repeat: 1,
  });
}

/**
 * Success button animation
 */
export function buttonSuccess(button) {
  const tl = gsap.timeline();

  tl.to(button, {
    scale: 1.1,
    duration: 0.15,
    ease: easings.snap,
  })
  .to(button, {
    scale: 1,
    duration: 0.4,
    ease: easings.bounce,
  });

  return tl;
}

// ==================== PAGE TRANSITIONS ====================

/**
 * Page enter animation
 */
export function pageEnter(element) {
  return gsap.fromTo(element,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: easings.smooth,
    }
  );
}

/**
 * Page exit animation
 */
export function pageExit(element) {
  return gsap.to(element, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    ease: easings.smoothIn,
  });
}

// ==================== UTILITY ANIMATIONS ====================

/**
 * Gentle pulse for drawing attention
 */
export function gentlePulse(element) {
  return gsap.to(element, {
    scale: 1.02,
    duration: 1.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

/**
 * Shimmer effect for loading states
 */
export function shimmer(element) {
  return gsap.to(element, {
    backgroundPosition: '200% 0',
    duration: 1.5,
    ease: 'linear',
    repeat: -1,
  });
}

/**
 * Confetti-like celebration
 */
export function celebrate(particles) {
  return gsap.fromTo(particles,
    {
      opacity: 1,
      scale: 0,
      x: 0,
      y: 0,
    },
    {
      opacity: 0,
      scale: 1,
      x: () => gsap.utils.random(-100, 100),
      y: () => gsap.utils.random(-100, 100),
      rotation: () => gsap.utils.random(-180, 180),
      duration: 0.8,
      ease: easings.smooth,
      stagger: 0.02,
    }
  );
}

// ==================== CONTEXT PROVIDER HELPERS ====================

/**
 * Kill all GSAP animations on an element
 */
export function killAnimations(element) {
  gsap.killTweensOf(element);
}

/**
 * Create a master timeline for page
 */
export function createPageTimeline() {
  return gsap.timeline({
    defaults: {
      ease: easings.smooth,
    },
  });
}
