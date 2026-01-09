# Food Xpiry - Smart Food Waste Tracker

## Project Overview

Next.js application for tracking food expiration dates with AI-powered shelf-life estimates and storage tips. Features a distinctive "fridge door" UI metaphor with delightful animations.

**URL**: my-expiry.vercel.app
**GitHub**: github.com/tbrown034/food-xpiry

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: GSAP + Framer Motion (motion/react)
- **AI**: OpenAI API for shelf-life estimates
- **Storage**: localStorage (client-side)
- **Deployment**: Vercel

## Getting Started

```bash
npm install
npm run dev
```

---

## Architecture Overview

### UI Metaphor: The Fridge

The app uses a "fridge" metaphor throughout:

1. **Fridge Door** (`HomePage.js`) - Main landing with sticky-note CTAs
2. **Fridge Handle** - Vertical handle on right side, opens to reveal fridge contents
3. **Freezer Drawer** (`FreezerDrawer.js`) - Bottom drawer with About info
4. **Sticky Notes** - Yellow/blue notes for "Add Items" and "My Fridge" actions

### Key Interactions (KISS Principle)

Two primary interactions, both working as in-place toggles:

| Interaction | Location | Behavior |
|-------------|----------|----------|
| Fridge Handle | Right side, vertical | Click to swing door open (3D rotateY), reveals fridge contents in-place |
| Freezer Drawer | Bottom, horizontal | Click to slide up About overlay, click again to close |

### Animation System

**GSAP** - Used for complex, coordinated animations:
- Fridge door opening (3D perspective transform)
- Freezer drawer slide-up with "pop" effect
- Magnet floating animations
- Frost crystal shimmer

**Framer Motion** - Used for component transitions:
- Page transitions (`AnimatePresence`)
- Button hover/tap states
- Sticky note hover effects

### State Management Pattern

`MainClient.js` uses a consolidated state pattern:

```javascript
// Modal state via useReducer (replaces 10+ useState calls)
const [modal, dispatchModal] = useReducer(modalReducer, { type: null, data: null });

// Modal types enum
const MODAL_TYPES = {
  NONE: null,
  ADD_FORM: 'addForm',
  BATCH_FORM: 'batchForm',
  DOCUMENT_UPLOAD: 'documentUpload',
  GROCERY_POPUP: 'groceryPopup',
  BATCH_POPUP: 'batchPopup',
  DOCUMENT_POPUP: 'documentPopup',
  EDIT: 'edit',
  DETAIL: 'detail',
  CLEAR_CONFIRM: 'clearConfirm',
};

// Pending data for multi-step flows
const [pendingData, setPendingData] = useState({
  groceryItem: null,
  batchResult: null,
  batchItems: null,
  documentResult: null,
});
```

---

## Component Reference

### Core Components

| Component | Path | Purpose |
|-----------|------|---------|
| `MainClient.js` | `/app/MainClient.js` | Main app orchestrator, state management |
| `HomePage.js` | `/app/components/HomePage.js` | Fridge door landing page |
| `FreezerDrawer.js` | `/app/components/FreezerDrawer.js` | Bottom drawer with About |
| `FridgeDoor.js` | `/app/components/FridgeDoor.js` | Fridge contents view |
| `AddToFridgePage.js` | `/app/components/AddToFridgePage.js` | Add method selection |
| `TypeItemsPage.js` | `/app/components/TypeItemsPage.js` | Manual item entry |

### SVG Components

| Component | Path | Purpose |
|-----------|------|---------|
| `Magnet.js` | `/app/components/svg/Magnet.js` | Colorful 3D magnet icons |
| `FridgeHandle.js` | `/app/components/svg/FridgeHandle.js` | Door handle with glow effect |
| `FrostPattern.js` | `/app/components/svg/FrostPattern.js` | Animated ice crystals |
| `PlusIcon.js` | `/app/components/svg/PlusIcon.js` | Animated plus icon |
| `FridgeIcon.js` | `/app/components/svg/FridgeIcon.js` | Fridge icon |

### Animation Utilities

| File | Purpose |
|------|---------|
| `/lib/gsapAnimations.js` | GSAP animation helpers (magnet float, entrance) |
| `/lib/motionVariants.js` | Framer Motion presets (springs, page transitions) |

---

## Design Decisions

### Viewport-Based Layout
- Uses `100dvh` for mobile browser compatibility
- Flexbox layout with `min-h-[calc(100dvh-64px)]` for content
- `max-w-4xl` constraint makes fridge look like an appliance on wide screens

### Animation Performance
- `will-change: transform` on animated elements
- GSAP animations properly cleaned up on unmount
- Refs copied before cleanup to avoid stale reference issues

### Error Handling
- All localStorage operations wrapped in try-catch
- User-facing error messages via toast notifications
- Graceful degradation if localStorage unavailable

### Responsive Breakpoints
- Mobile: Default styles
- `sm:` (640px+): Larger text, more padding
- `md:` (768px+): Horizontal layouts

---

## Recent Changes (2026-01-08)

### User-Friendly Expiry Dates & Category Icons

**Problem**: Raw dates like "2026-01-15" aren't immediately useful. Users need to know "how many days until this expires?"

**Solution**: Added `formatExpiryDate()` utility that returns contextual expiry info:

```javascript
// lib/utils.js
export const formatExpiryDate = (expiryDateStr) => {
  // Returns: { text: "Expires tomorrow", color: "text-orange-600", urgent: true }
  // Color-coded by urgency:
  // - Red: Expired, today, tomorrow
  // - Orange: 2-3 days
  // - Yellow: 4-7 days
  // - Green: 8+ days (shows date like "Thu, Jan 15")
};
```

**Category Icons**: Added heroicons for visual category identification:

```javascript
// lib/categoryIcons.js
import { BeakerIcon, FireIcon, ... } from '@heroicons/react/24/outline';

export const categoryIcons = {
  Dairy: BeakerIcon,
  Meat: FireIcon,
  Vegetables: SparklesIcon,
  Fruits: SunIcon,
  Bakery: CakeIcon,
  Frozen: CloudIcon,
  Pantry: ShoppingBagIcon,
  Beverages: BeakerIcon,
  Other: CubeIcon,
};

export function getCategoryIcon(category) {
  return categoryIcons[category] || CubeIcon;
}
```

**Updated Components**:
- `BatchGroceryPopup.js` - Stage 2 shows icons + "Expires in X days"
- `StickyNote.js` - Fridge items show category icons + expiry text
- `GroceryDetailModal.js` - Large category icon in detail view
- `GroceryItemPopup.js` - Restyled as sticky note with icon + expiry preview

**Dependencies Added**:
- `@heroicons/react` - Icon library

### Component Folder Reorganization

Reorganized `/app/components/` into subfolders:

```
components/
├── forms/          # Input forms
│   ├── AddGroceryForm.js
│   ├── BatchAddGroceryForm.js
│   └── ReceiptUpload.js
├── layout/         # Structural components
│   ├── Header.js
│   ├── HeaderClient.js
│   └── FreezerDrawer.js
├── modals/         # Modal dialogs
│   ├── Modal.js
│   ├── ConfirmationModal.js
│   ├── BatchGroceryPopup.js
│   ├── GroceryItemPopup.js
│   ├── GroceryDetailModal.js
│   ├── EditGroceryModal.js
│   └── DocumentAnalysisPopup.js
├── pages/          # Page-level components
│   ├── HomePage.js
│   ├── FridgeDoor.js
│   ├── AddToFridgePage.js
│   └── TypeItemsPage.js
├── ui/             # Reusable UI elements
│   ├── Toast.js
│   ├── LoadingSpinner.js
│   ├── ActionMenu.js
│   └── StickyNote.js
└── svg/            # Icon components
    ├── index.js
    ├── FridgeHandle.js
    ├── Magnet.js
    ├── FrostPattern.js
    └── AnimatedIcons.js
```

### UX Overhaul

**Fridge Door Interaction**
- Changed from page navigation to in-place reveal
- Door swings open with 3D `rotateY(-75deg)` animation
- Inside content fades in as door opens
- Close handle appears on left side of opened fridge

**Freezer Drawer Interaction**
- Changed from slide-away to overlay modal
- Slides up from bottom with "pop" effect
- Backdrop blur when open
- Toggle behavior (click to open/close)

### State Management Refactor

**Before**: 26 individual `useState` hooks
**After**: Consolidated pattern with:
- `useReducer` for modal state (10 states → 1)
- Single `pendingData` object for multi-step flows
- Single `isLoading` state (replaces 2)

**Removed Dead Code**:
- Easter egg feature (`easterEggClicks`, `showEasterEgg`)
- Landing page code path (`showLanding`, `LandingPage` import)
- Unused utilities (`sortGroceries`, `getCategoryColorClass`)
- Unused components (`FoodInventory`, `GroceryAnalysisPopup`)

### Code Quality Improvements

- Fixed all ESLint warnings (ref cleanup in useEffect)
- Added `will-change` CSS hints for animation performance
- Removed all `console.error` statements
- Added proper localStorage error handling
- Wrapped handlers in `useCallback` with correct dependencies

### Dead Code Cleanup

**Deleted Components** (~81KB removed):
- `AIConfirmationModal.js` - Never imported
- `GroceryAnalysisPopup.js` - Removed from MainClient, never used
- `LandingPage.js` - Removed from MainClient, never used
- `ReportPopup.js` - Never imported
- `StatsSection.js` - Never imported
- `ThemeProvider.js` - Never imported
- `FoodInventory.js` - Replaced by FridgeDoor view
- `GroceryList.js` - Replaced by FridgeDoor view
- `CountdownTimer.js` - Only used by deleted components

**Components folder**: 36 files → 25 files (268KB)

---

## File Structure

```
food-xpiry/
├── app/
│   ├── MainClient.js           # Main orchestrator
│   ├── page.js                 # Root page
│   ├── layout.js               # Root layout
│   ├── components/
│   │   ├── forms/              # Input forms
│   │   │   ├── AddGroceryForm.js
│   │   │   ├── BatchAddGroceryForm.js
│   │   │   └── ReceiptUpload.js
│   │   ├── layout/             # Structural components
│   │   │   ├── Header.js
│   │   │   ├── HeaderClient.js
│   │   │   └── FreezerDrawer.js
│   │   ├── modals/             # Modal dialogs
│   │   │   ├── Modal.js
│   │   │   ├── ConfirmationModal.js
│   │   │   ├── BatchGroceryPopup.js
│   │   │   ├── GroceryItemPopup.js
│   │   │   ├── GroceryDetailModal.js
│   │   │   ├── EditGroceryModal.js
│   │   │   └── DocumentAnalysisPopup.js
│   │   ├── pages/              # Page-level components
│   │   │   ├── HomePage.js
│   │   │   ├── FridgeDoor.js
│   │   │   ├── AddToFridgePage.js
│   │   │   └── TypeItemsPage.js
│   │   ├── ui/                 # Reusable UI elements
│   │   │   ├── Toast.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── ActionMenu.js
│   │   │   └── StickyNote.js
│   │   └── svg/                # Icon components
│   │       ├── index.js
│   │       ├── FridgeHandle.js
│   │       ├── Magnet.js
│   │       ├── FrostPattern.js
│   │       └── AnimatedIcons.js
│   ├── tracking/               # Tracking page
│   ├── about/                  # About page
│   └── api/                    # API routes
│       ├── get-shelf-life/
│       ├── parse-items/
│       ├── analyze-receipt/
│       ├── get-freshness-info/
│       └── quick-shelf-life/
├── lib/
│   ├── storage.js              # localStorage wrapper
│   ├── utils.js                # Utility functions + formatExpiryDate
│   ├── types.js                # Category enum, status types
│   ├── categoryIcons.js        # Heroicons mapping for categories
│   ├── motionVariants.js       # Framer Motion presets
│   ├── gsapAnimations.js       # GSAP animation helpers
│   ├── errorHandling.js        # Error utilities
│   └── foodSafetyFacts.js      # Fun facts for loading
├── CLAUDE.md                   # This file (dev docs)
└── README.md                   # Public documentation
```

---

## Workspace Context

**Project Name**: food-xpiry (renamed from my-expiry)
**Location**: `~/Desktop/ActiveProjects/food-xpiry`
**GitHub**: github.com/tbrown034/food-xpiry

This project is part of Trevor Brown's ActiveProjects workspace:
- Workspace docs: `~/Desktop/ActiveProjects/_docs/`
- Project status: See `_docs/status.md` for all project statuses
- Naming convention: kebab-case

Last updated: 2026-01-09

---

## Recent Changes (2026-01-09) - Major UI/UX Overhaul

### Design Philosophy: KISS (Keep It Simple, Stupid)

After reviewing the UI, we identified over-engineering issues:
- 3D door animations that were confusing, not delightful
- Frost patterns, metallic textures, vignettes - looked "AI-generated"
- Busy item list with too many badges, buttons, stats visible at once
- Generic heroicons that didn't convey what food items actually were

**New principles applied:**
1. Clean, minimalist design over flashy effects
2. Modern phone/web UI patterns users recognize
3. Progressive disclosure - show options only when needed
4. Consistent fridge metaphor without being overly realistic

### UI Changes Summary

**Header** (`HeaderClient.js`):
- Replaced random globe icon with simple fridge outline
- Removed gradients, shadows, embossed effects

**Homepage** (`HomePage.js`):
- Removed 3D door swing animation entirely
- Simple sticky notes for navigation (Add Items, My Fridge)
- Added vertical fridge handle on right side with "Open" hint
- Kept subtle magnet float animations (GSAP)

**Fridge View** (`FridgeDoor.js`):
- Door edge with handle on LEFT side (counter-clockwise swing from right handle)
- Clean white/gray interior like real fridge
- Simple nav bar: Close, title, Add button

**Fridge Contents** (`FridgeContents.js`):
- Shelves organized by urgency: "Use Soon", "This Week", "Fresh for a While"
- Grid layout (4-5 items per row) like food on real fridge shelves
- Crisper drawer at bottom for long-lasting items
- Food emojis for instant visual recognition

**Freezer Drawer** (`FreezerDrawer.js`):
- Rebuilt with Framer Motion (was broken GSAP)
- Clean slide-up menu with About, Stats, Settings

### Why Emojis Were Allowed (Exception to the Rule)

**Context**: The project generally avoids emojis in code/UI for a cleaner look.

**Why emojis make sense here:**
1. **Instant recognition** - 🍕 is faster to parse than "Pizza" + generic icon
2. **Fits the fridge metaphor** - Cartoon-style fridge with playful food items
3. **Universal** - Emojis work across platforms, no icon library needed
4. **Functional, not decorative** - They convey information (what the food is)

**Where emojis are NOT used:**
- Header, navigation, buttons (text + minimal icons)
- Section headers use sparingly (⚠️ for urgent shelf)
- No emoji spam in text content

---

## Food Emoji System (`lib/foodEmojis.js`)

### How It Works

```javascript
getFoodEmoji(name, category) → emoji

// 1. Keyword matching (priority order)
//    - Check if item name contains known food keywords
//    - "Dominos Pizza" contains "pizza" → 🍕
//
// 2. Category fallback
//    - If no keyword match, use category emoji
//    - Category "Dairy" → 🥛
//
// 3. Default fallback
//    - If nothing matches → 🍽️
```

### Matching Algorithm (v2 - Improved)

**Problems with simple `includes()` matching:**
1. Order dependency - "orange juice" might match "orange" (🍊) before "juice" (🧃)
2. Substring issues - "pineapple" contains "apple"
3. No context - "ice cream" vs "ice" (frozen food)
4. Compound foods - "chicken salad" has two keywords

**Solutions implemented:**
1. **Compound phrases first** - Check "orange juice", "ice cream" before single words
2. **Longer keywords first** - Sort by length descending
3. **Word boundary preference** - Prefer whole word matches
4. **Category-aware disambiguation** - Use category to break ties

### Edge Cases Handled

| Item Name | Naive Match | Smart Match | Reason |
|-----------|-------------|-------------|--------|
| Orange Juice | 🍊 (orange) | 🧃 (juice) | Compound phrase priority |
| Pineapple | 🍎 (apple) | 🍍 (pineapple) | Longer keyword first |
| Chicken Salad | 🍗 (chicken) | 🥗 (salad) | Category: Vegetables wins |
| Ice Cream | 🧊 (ice) | 🍦 (ice cream) | Compound phrase priority |
| Buttermilk | 🥛 (milk) | 🥛 (milk) | Acceptable - it IS milk-based |

### Adding New Foods

```javascript
// In lib/foodEmojis.js

// 1. Add compound phrases (checked first)
const compoundPhrases = {
  'orange juice': '🧃',
  'ice cream': '🍦',
  'peanut butter': '🥜',
  // ...
};

// 2. Add single keywords
const foodKeywords = {
  pizza: '🍕',
  chicken: '🍗',
  // ...
};

// 3. Category fallbacks (last resort)
const categoryEmojis = {
  Dairy: '🥛',
  Meat: '🥩',
  // ...
};
```

---

## Component Architecture (Updated)

### File Structure

```
app/components/
├── layout/
│   ├── HeaderClient.js    # Minimalist header with fridge icon
│   └── FreezerDrawer.js   # Bottom slide-up menu (Framer Motion)
├── pages/
│   ├── HomePage.js        # Fridge door with sticky notes + handle
│   └── FridgeDoor.js      # Open fridge interior with door edge
├── ui/
│   └── FridgeContents.js  # Shelf grid with emoji food items
└── svg/
    └── ...                # Magnet, icons (minimal use now)

lib/
├── foodEmojis.js          # NEW: Emoji mapping with smart matching
├── categoryIcons.js       # Heroicons (still used in modals)
└── ...
```

### Fridge Metaphor Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│  HOMEPAGE (Closed Fridge Door)                              │
│  ┌─────────────────────────────────────────────────────┬──┐ │
│  │                                                     │  │ │
│  │   ┌─────────────┐                                   │H │ │
│  │   │ Add Items   │ ← Yellow sticky note              │A │ │
│  │   └─────────────┘                                   │N │ │
│  │                                                     │D │ │
│  │   ┌─────────────┐                                   │L │ │
│  │   │ My Fridge   │ ← Blue sticky note                │E │ │
│  │   └─────────────┘                                   │  │ │
│  │                                                     │  │ │
│  ├─────────────────────────────────────────────────────┴──┤ │
│  │  ═══════════════ MENU ═══════════════                  │ │ ← Freezer drawer
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  FRIDGE VIEW (Open - door swung left)                       │
│  ┌──┬──────────────────────────────────────────────────────┐│
│  │D │  ┌─ USE SOON ─────────────────────────────────────┐  ││
│  │O │  │  🍕    🍗    🧀    🥩                          │  ││
│  │O │  └────────────────────────────────────────────────┘  ││
│  │R │  ════════════════════════════════════════════════════││
│  │  │  ┌─ THIS WEEK ────────────────────────────────────┐  ││
│  │E │  │  🍗    🍖    🥓    🥪    🥛    🍱              │  ││
│  │D │  └────────────────────────────────────────────────┘  ││
│  │G │  ════════════════════════════════════════════════════││
│  │E │  ┌─ FRESH FOR A WHILE (Crisper) ──────────────────┐  ││
│  │  │  │  🥚    🍕    ☕                                 │  ││
│  │H │  └────────────────────────────────────────────────┘  ││
│  │A │                                                      ││
│  │N │                                              [+FAB]  ││
│  │D │                                                      ││
│  │L │                                                      ││
│  │E │                                                      ││
│  └──┴──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Testing Checklist

After UI changes, verify:
- [ ] Homepage loads with sticky notes and handle visible
- [ ] Clicking handle opens fridge view
- [ ] Door edge appears on LEFT when open (counter-clockwise)
- [ ] Food items show correct emojis (pizza → 🍕)
- [ ] Urgency shelves color-coded (red, amber, gray)
- [ ] Clicking item opens detail modal
- [ ] Freezer drawer slides up from bottom
- [ ] Mobile responsive (4 cols → 5 cols on larger screens)
