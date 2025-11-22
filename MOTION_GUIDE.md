# 🧲 MAGNETIC NOTES MOTION GUIDE

A cohesive animation system for My-Expiry based on the metaphor of sticky notes on a refrigerator door.

---

## 🎯 ANIMATION PHILOSOPHY

**Everything follows real-world physics:**
- **Sticky notes** = Light, paper-like, flutter and curl
- **Refrigerator** = Heavy, solid, metallic slide
- **Magnets** = Snap and stick with satisfying resistance
- **Gravity** = Natural settling and floating

**Consistency rules:**
- Entrances use "magnetic snap" or "paper float"
- Exits use "curl & peel"
- Page transitions use "fridge door slide"
- Hovers use "lift off magnet"
- All animations respect the same spring physics

---

## 📋 IMPLEMENTATION MAP

### 1. **FRIDGE DOOR** (FridgeDoor.js)

#### Sticky Notes Cascade Entrance
```jsx
import { motion } from 'motion/react';
import { variants, springs, gestures, staggerConfigs } from '../lib/motionVariants';

// Container
<motion.div
  variants={variants.fade}
  initial="initial"
  animate="animate"
  transition={staggerConfigs.stickyNotesCascade}
  className="grid..."
>
  {groupedByBatch.map((note, index) => (
    <motion.div
      key={note.noteId}
      variants={variants.stickyNoteEnter}
      transition={springs.magnetSnap}
      {...gestures.hoverLift}
      className="sticky-note-wrapper"
    >
      <StickyNote {...props} />
    </motion.div>
  ))}
</motion.div>
```

**Effect:**
- Notes cascade in one by one (stagger)
- Each snaps into place with spring physics
- Hover lifts note slightly off fridge
- Creates sense of "magnetic attachment"

---

#### Stats Counter Animation
```jsx
import { motion, useInView, useMotionValue, useSpring } from 'motion/react';

const AnimatedNumber = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, springs.paperFloat);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
  }, [springValue]);

  return <span ref={ref}>{displayValue}</span>;
};

// Usage in stats:
<AnimatedNumber value={stats.active} />
```

**Effect:**
- Numbers count up when scrolled into view
- Smooth spring animation
- Only animates once

---

### 2. **STICKY NOTE COMPONENT** (StickyNote.js)

#### Individual Item Swipe-to-Delete
```jsx
import { motion } from 'motion/react';
import { dragConfigs, variants, springs } from '../lib/motionVariants';

<motion.li
  {...dragConfigs.swipeDelete}
  onDragEnd={(e, { offset }) => {
    if (offset.x < -100) {
      // Trigger delete with peel animation
      onDeleteItem(item.id);
    }
  }}
  exit={variants.listItemSwipe.exit}
  className="item"
>
  {item.name}
</motion.li>
```

**Effect:**
- Swipe left reveals delete action
- Resistance like pulling sticky note
- Peels away when deleted
- Snaps back if not swiped enough

---

#### Note Delete Animation (Whole Note)
```jsx
<motion.div
  exit={{
    x: 100,
    y: -20,
    rotate: 12,
    opacity: 0,
    scale: 0.95,
    transition: springs.curlPeel
  }}
>
  <StickyNote />
</motion.div>
```

**Effect:**
- Peels off fridge at angle
- Curls slightly (rotate)
- Fades while moving

---

### 3. **ACTION MENU** (ActionMenu.js)

```jsx
import { motion, AnimatePresence } from 'motion/react';
import { variants } from '../lib/motionVariants';

<AnimatePresence>
  {isOpen && (
    <motion.div
      variants={variants.dropdownFloat}
      initial="initial"
      animate="animate"
      exit="exit"
      className="menu"
    >
      {actions.map((action) => (
        <motion.button
          key={action.label}
          whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.05)" }}
          transition={{ duration: 0.15 }}
        >
          {action.label}
        </motion.button>
      ))}
    </motion.div>
  )}
</AnimatePresence>
```

**Effect:**
- Floats down like paper
- Menu items slide on hover
- Smooth exit

---

### 4. **PAGE TRANSITIONS** (MainClient.js)

```jsx
import { AnimatePresence, motion } from 'motion/react';
import { variants } from '../lib/motionVariants';

<AnimatePresence mode="wait">
  {currentView === 'home' && (
    <motion.div
      key="home"
      variants={variants.fridgeSlide}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <HomePage />
    </motion.div>
  )}
  {currentView === 'add' && (
    <motion.div
      key="add"
      variants={variants.fridgeSlide}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <AddToFridgePage />
    </motion.div>
  )}
  {currentView === 'fridge' && (
    <motion.div
      key="fridge"
      variants={variants.fridgeSlide}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <FridgeDoor />
    </motion.div>
  )}
</AnimatePresence>
```

**Effect:**
- Pages slide like heavy fridge door
- Smooth easing curve
- Current page slides out, new page slides in

---

### 5. **MODALS** (ConfirmationModal, GroceryDetailModal)

```jsx
// In Modal.js base component
import { motion, AnimatePresence } from 'motion/react';
import { variants } from '../lib/motionVariants';

<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        variants={variants.modalSnap}
        initial="initial"
        animate="animate"
        exit="exit"
        className="modal"
      >
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**Effect:**
- Modal snaps into place (magnetic)
- Backdrop fades smoothly
- Exit feels like detaching magnet

---

### 6. **TOAST NOTIFICATIONS** (Toast.js)

```jsx
import { motion, AnimatePresence } from 'motion/react';
import { variants } from '../lib/motionVariants';

<AnimatePresence>
  {isVisible && (
    <motion.div
      variants={variants.toastSlide}
      initial="initial"
      animate="animate"
      exit="exit"
      className="toast"
    >
      {message}
    </motion.div>
  )}
</AnimatePresence>
```

**Effect:**
- Slides in from right
- Snaps into place
- Slides back out

---

### 7. **TYPE ITEMS PAGE** (TypeItemsPage.js)

#### Line-by-line entrance
```jsx
<motion.div
  initial="initial"
  animate="animate"
  variants={variants.fade}
  transition={staggerConfigs.listQuick}
>
  {lines.map((line, index) => (
    <motion.div
      key={index}
      variants={variants.listItemEnter}
      layout
    >
      <input value={line} />
    </motion.div>
  ))}
</motion.div>
```

**Effect:**
- Lines appear with stagger
- Layout smoothly shifts when adding/removing
- Feels like writing on notepad

---

### 8. **BUTTONS** (Global)

```jsx
import { motion } from 'motion/react';
import { gestures } from '../lib/motionVariants';

// Primary action buttons
<motion.button
  {...gestures.buttonPress}
  className="btn-primary"
>
  Add Items
</motion.button>

// Icon buttons
<motion.button
  {...gestures.subtleHover}
  className="icon-btn"
>
  <Icon />
</motion.button>
```

**Effect:**
- Satisfying press feedback
- Scale on hover/tap
- Consistent across all buttons

---

### 9. **HOMEPAGE** (HomePage.js)

#### 3D Fridge Door Entrance
```jsx
<motion.div
  initial={{
    opacity: 0,
    rotateY: -15,
    scale: 0.9
  }}
  animate={{
    opacity: 1,
    rotateY: 0,
    scale: 1
  }}
  transition={springs.magnetSnap}
  style={{ perspective: "1000px" }}
  className="fridge-container"
>
  {/* Fridge door */}
</motion.div>
```

**Effect:**
- Fridge door swings open slightly
- 3D perspective entrance
- Heavy, solid feel

---

### 10. **BATCH GROCERY POPUP** (BatchGroceryPopup.js)

#### Progress indicator with spring
```jsx
const ProgressDots = ({ currentStep, totalSteps }) => (
  <div className="flex gap-2">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <motion.div
        key={i}
        animate={{
          scale: i === currentStep ? 1.2 : 1,
          backgroundColor: i === currentStep ? "#10b981" : "#d1d5db"
        }}
        transition={springs.cheerful}
        className="w-3 h-3 rounded-full"
      />
    ))}
  </div>
);
```

**Effect:**
- Active step bounces
- Color transitions smoothly
- Clear visual progress

---

## 🎨 CONSISTENT PATTERNS

### Appearing
- Use `variants.stickyNoteEnter` for cards/notes
- Use `variants.modalSnap` for popups
- Use `variants.dropdownFloat` for menus
- Use `variants.listItemEnter` for list items

### Disappearing
- Use `variants.stickyNotePeel` for removing notes
- Use `variants.listItemSwipe` for deleting items
- Use `exit: { opacity: 0 }` for simple fades

### Transitions
- Use `variants.fridgeSlide` for page changes
- Use spring physics for everything else
- Never use linear easing

### Hover States
- Use `gestures.hoverLift` for cards/notes
- Use `gestures.buttonPress` for buttons
- Use `gestures.subtleHover` for icons

---

## ⚡ PERFORMANCE TIPS

1. **Use `layout` prop sparingly** - only on lists that frequently change
2. **AnimatePresence mode="wait"** - for page transitions to avoid overlap
3. **Transform over position** - use x/y transforms, not left/top
4. **GPU acceleration** - Motion handles this automatically
5. **Reduce motion** - Respect `prefers-reduced-motion`:

```jsx
const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const transition = shouldReduceMotion
  ? { duration: 0.01 }
  : springs.magnetSnap;
```

---

## 🎯 PRIORITY IMPLEMENTATION ORDER

**Phase 1 (Biggest Impact):**
1. ✅ ActionMenu dropdown (variants.dropdownFloat)
2. ✅ Button hovers (gestures.buttonPress)
3. Page transitions (variants.fridgeSlide)
4. Modal entrances (variants.modalSnap)

**Phase 2 (Polish):**
5. Sticky note cascade (stagger)
6. Hover lift on notes (gestures.hoverLift)
7. Toast slide-in (variants.toastSlide)
8. List item stagger

**Phase 3 (Advanced):**
9. Swipe-to-delete
10. Stats count-up
11. Layout animations
12. 3D fridge entrance

---

## 🧪 TESTING CHECKLIST

- [ ] Animations respect reduced motion preference
- [ ] No jank on mobile (60fps minimum)
- [ ] Animations complete before user can interact
- [ ] Exit animations finish before element unmounts
- [ ] Consistent spring feel across all interactions
- [ ] No competing animations (one at a time)

---

## 📖 RESOURCES

- Motion docs: https://motion.dev/docs
- Spring configurator: https://motion.dev/tools/spring
- Animation examples: https://motion.dev/examples

---

**Remember:** Every animation should feel like interacting with real sticky notes on a real fridge. If it doesn't feel "physical," it's wrong.
