/**
 * MAGNETIC NOTES ANIMATION SYSTEM
 *
 * A cohesive animation language for My-Expiry app based on the metaphor
 * of paper sticky notes on a refrigerator door.
 *
 * Core principles:
 * - Magnetic snap: Items attach with satisfying snap
 * - Paper float: Organic, lightweight settling
 * - Curl & peel: Items remove like peeling paper
 * - Fridge door: Heavy, solid transitions
 * - Hover lift: Magnetic weakening on interaction
 */

// ==================== SPRING PHYSICS ====================

export const springs = {
  // Quick, snappy - for attaching to fridge
  magnetSnap: {
    type: "spring",
    stiffness: 300,
    damping: 20,
    mass: 0.5
  },

  // Gentle, organic - for paper-like settling
  paperFloat: {
    type: "spring",
    stiffness: 100,
    damping: 15,
    mass: 0.3
  },

  // Medium resistance - for peeling away
  curlPeel: {
    type: "spring",
    stiffness: 200,
    damping: 25,
    mass: 0.4
  },

  // Bouncy - for success states
  cheerful: {
    type: "spring",
    stiffness: 400,
    damping: 20,
    mass: 0.6
  },

  // Smooth - for subtle movements
  gentle: {
    type: "spring",
    stiffness: 150,
    damping: 20,
    mass: 0.2
  }
};

// ==================== EASING CURVES ====================

export const easings = {
  // Heavy fridge door slide
  fridgeDoor: [0.43, 0.13, 0.23, 0.96],

  // Smooth in/out
  smooth: [0.4, 0.0, 0.2, 1],

  // Sharp snap
  snap: [0.68, -0.55, 0.265, 1.55],

  // Organic flow
  organic: [0.33, 1, 0.68, 1]
};

// ==================== VARIANT PRESETS ====================

export const variants = {
  // Sticky note appearing on fridge
  stickyNoteEnter: {
    initial: {
      scale: 0.8,
      y: -30,
      rotate: -5,
      opacity: 0
    },
    animate: {
      scale: 1,
      y: 0,
      rotate: 0,
      opacity: 1
    },
    exit: {
      x: 100,
      rotate: 8,
      opacity: 0,
      scale: 0.9
    }
  },

  // Sticky note leaving fridge (peel away)
  stickyNotePeel: {
    exit: {
      x: 100,
      y: -20,
      rotate: 12,
      opacity: 0,
      scale: 0.95,
      transition: springs.curlPeel
    }
  },

  // Fridge door page transition (slide)
  fridgeSlide: {
    initial: { x: "100%", opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.4,
        ease: easings.fridgeDoor
      }
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: easings.fridgeDoor
      }
    }
  },

  // Modal/popup appearing (magnetic snap)
  modalSnap: {
    initial: {
      scale: 0.9,
      opacity: 0,
      y: 20
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: springs.magnetSnap
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      y: 10,
      transition: springs.gentle
    }
  },

  // Dropdown menu (paper float down)
  dropdownFloat: {
    initial: {
      y: -10,
      opacity: 0,
      scale: 0.95
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: springs.paperFloat
    },
    exit: {
      y: -10,
      opacity: 0,
      scale: 0.95,
      transition: springs.gentle
    }
  },

  // List item appearing (stagger friendly)
  listItemEnter: {
    initial: {
      x: -20,
      opacity: 0
    },
    animate: {
      x: 0,
      opacity: 1
    }
  },

  // List item removing (swipe away)
  listItemSwipe: {
    exit: {
      x: 100,
      opacity: 0,
      transition: springs.curlPeel
    }
  },

  // Toast notification (slide from right)
  toastSlide: {
    initial: {
      x: 400,
      opacity: 0,
      scale: 0.9
    },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: springs.magnetSnap
    },
    exit: {
      x: 400,
      opacity: 0,
      scale: 0.9,
      transition: springs.gentle
    }
  },

  // Success state (cheerful bounce)
  successPop: {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: springs.cheerful
    }
  },

  // Fade in/out (subtle)
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }
};

// ==================== GESTURE VARIANTS ====================

export const gestures = {
  // Hover lift (note lifting off fridge)
  hoverLift: {
    whileHover: {
      y: -6,
      rotate: 1,
      scale: 1.02,
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      transition: springs.gentle
    },
    whileTap: {
      scale: 0.98,
      y: 0
    }
  },

  // Button press
  buttonPress: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  },

  // Subtle hover (for small elements)
  subtleHover: {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 }
  }
};

// ==================== DRAG CONFIGS ====================

export const dragConfigs = {
  // Swipe to delete (magnetic resistance)
  swipeDelete: {
    drag: "x",
    dragConstraints: { left: -150, right: 0 },
    dragElastic: 0.2,
    dragMomentum: false
  },

  // Free drag (reordering)
  freeDrag: {
    drag: true,
    dragElastic: 0.1,
    dragMomentum: true
  },

  // Constrained drag
  constrainedDrag: {
    drag: true,
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    dragElastic: 0.3
  }
};

// ==================== STAGGER CONFIGS ====================

export const staggerConfigs = {
  // Sticky notes appearing in sequence
  stickyNotesCascade: {
    staggerChildren: 0.05,
    delayChildren: 0.1
  },

  // List items appearing quickly
  listQuick: {
    staggerChildren: 0.03
  },

  // Slow, elegant entrance
  elegant: {
    staggerChildren: 0.1,
    delayChildren: 0.2
  }
};

// ==================== LAYOUT ANIMATIONS ====================

export const layoutConfigs = {
  // Smooth layout shifts
  smooth: {
    layout: true,
    transition: springs.paperFloat
  },

  // Quick layout changes
  quick: {
    layout: true,
    transition: springs.gentle
  }
};

// ==================== USAGE EXAMPLES ====================

/*
STICKY NOTE ON FRIDGE:
<motion.div
  variants={variants.stickyNoteEnter}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={springs.magnetSnap}
  {...gestures.hoverLift}
>
  <StickyNote />
</motion.div>

PAGE TRANSITION:
<AnimatePresence mode="wait">
  <motion.div
    key={currentView}
    variants={variants.fridgeSlide}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    <Page />
  </motion.div>
</AnimatePresence>

STAGGERED LIST:
<motion.ul
  variants={variants.fade}
  initial="initial"
  animate="animate"
  transition={staggerConfigs.listQuick}
>
  {items.map(item => (
    <motion.li
      key={item.id}
      variants={variants.listItemEnter}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>

SWIPE TO DELETE:
<motion.div
  {...dragConfigs.swipeDelete}
  onDragEnd={(e, info) => {
    if (info.offset.x < -100) {
      deleteItem();
    }
  }}
>
  <Item />
</motion.div>
*/
