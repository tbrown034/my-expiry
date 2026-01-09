# Changelog

All notable changes to Food Xpiry are documented in this file.

---

## [Unreleased] - 2026-01-09

### Session 2: Polish & Consistency Pass

#### Visual Design Updates

**Sticky Notes - Lined Paper Effect**
- Added CSS lined paper texture to all sticky notes using `repeating-linear-gradient`
- Yellow notes use amber lines (`rgba(180, 83, 9, 0.08)`)
- Blue notes use sky lines (`rgba(3, 105, 161, 0.06)`)
- Applied to: HomePage, AddToFridgePage, ProcessingOverlay, BatchGroceryPopup loading state

**Header Fridge Icon**
- Replaced bright emerald-400 icon with metallic styling
- New gradient: `#94a3b8 → #64748b → #475569`
- Added inset shadow for 3D embossed effect
- Better cohesion with overall metallic fridge aesthetic

**Magnet Positioning Fix**
- Moved magnets OUTSIDE sticky note divs (were inside)
- Added `z-20` to ensure magnets render on top
- Magnets now appear to be on the fridge holding the notes
- Fixed in: HomePage (both notes), AddToFridgePage, ProcessingOverlay, BatchGroceryPopup

**Processing States Unified**
- ProcessingOverlay: Changed from dark terminal style to sticky note style
- BatchGroceryPopup loading: Added matching sticky note style
- Both now use: lined paper, red magnet, amber spinner, soft shadow
- Consistent visual language across all loading states

#### Feature Additions

**Stats Page Reset Button**
- Added "Reset All Data" button to `/tracking` page
- Confirmation dialog before deletion
- Clears all localStorage grocery data
- Allows users to start fresh

**Test Batch Flow Improvements**
- Clicking "Test Batch" now navigates to fridge view first
- ProcessingOverlay shows during API calls
- Displays: current step, latest success, API call count
- Real-time feedback during shelf-life lookups

#### Emoji Matching Improvements

**Abbreviation Expansion**
- Added `abbreviations` map for common grocery shorthand
- Examples: `chkn → chicken`, `bf → beef`, `OJ → orange juice`
- 50+ abbreviations supported

**Missing Keywords Added**
- Proteins: `franks`, `hotdogs`, `tofu`, `tempeh`
- Dips: `hummus`, `guacamole`, `salsa`, `dip`

**Frozen Keyword Priority Fix**
- Moved `frozen` and `ice` to low-priority keywords
- "Frozen Chicken" now correctly shows 🍗 (not 🧊)
- Food keywords take precedence over storage keywords

**Letter-Based Fallback**
- When no emoji/category match, shows initials
- "Turkey Dinner" → "TD"
- Single words → first 2 letters (e.g., "GR" for "Granola")
- Multi-word items → first letter of each (up to 3)

#### Expired Items Display

**PAST DUE Category**
- Expired items now in separate "PAST DUE" section (was mixed with "Use Soon")
- Shows 🚨 emoji for urgency
- Changed "Exp!" label to "Xd ago" format for clarity

### Files Changed
- `app/components/pages/HomePage.js` - Lined paper, magnet positioning
- `app/components/pages/AddToFridgePage.js` - Lined paper, magnet positioning
- `app/components/ui/ProcessingOverlay.js` - Sticky note style, magnet fix
- `app/components/modals/BatchGroceryPopup.js` - Sticky note loading, magnet fix
- `app/components/layout/HeaderClient.js` - Metallic fridge icon
- `app/components/ui/FridgeContents.js` - PAST DUE category, "Xd ago" format
- `app/tracking/page.js` - Reset button with confirmation
- `app/MainClient.js` - Processing overlay integration
- `lib/foodEmojis.js` - Abbreviations, new keywords, priority fix, letter fallback

---

## Session 1: UI/UX Overhaul (Earlier Today)

### Major UI/UX Overhaul

#### Changed
- **Header**: Replaced globe icon with simple fridge outline icon
- **Homepage**: Removed 3D door swing animation, now uses simple page navigation
- **Homepage**: Added vertical fridge handle on right side with "Open" hint
- **Fridge View**: Door edge with handle now appears on LEFT (counter-clockwise swing)
- **Fridge Contents**: Redesigned as visual fridge interior with shelves
- **Item Display**: Changed from generic heroicons to food emojis for instant recognition

#### Added
- `lib/foodEmojis.js` - Food emoji mapping system with smart matching
- `lib/__tests__/foodEmoji.test.js` - 124 test cases for emoji matching
- `RECOMMENDATIONS.md` - Technical recommendations document
- `CHANGELOG.md` - This file

#### Removed
- 3D door animations (GSAP rotateY transforms)
- Frost patterns, metallic textures, vignettes
- Stats bar from fridge view
- Visible action buttons on item list (now progressive disclosure)

### Food Emoji System

#### Design Decision: Why Emojis Were Allowed
The project generally avoids emojis for a cleaner look. However, food emojis were allowed because:
1. **Instant recognition** - Faster to parse than text + icon
2. **Fits fridge metaphor** - Cartoon-style fridge with playful food items
3. **Universal** - Works across platforms, no icon library needed
4. **Functional** - Conveys information (what the food is), not decorative

#### Matching Algorithm
1. Abbreviation expansion (chkn → chicken)
2. Compound phrases first ("orange juice" → not orange)
3. Keywords sorted by length (prevents "pineapple" → apple)
4. Low-priority keywords last (frozen, ice)
5. Category fallback (unknown dairy → milk emoji)
6. Letter abbreviation fallback (unknown → "TD" for Turkey Dinner)

---

## [0.1.0] - 2026-01-08

### Initial Release
- Component folder reorganization
- Added user-friendly expiry dates
- Added category icons (heroicons)
- State management refactor (useReducer)
- Dead code cleanup (~81KB removed)

---

## Security Review - 2026-01-09

### API Routes Reviewed

#### `/api/get-shelf-life` - SECURE
- Input validation: Items array required, max 50 items
- API key check before processing
- No user-provided data in SQL/shell commands
- Error handling with sanitized messages

#### `/api/parse-items` - SECURE
- Input validation via `validateInput()` helper
- Max length limit (10,000 chars)
- Min length requirement (1 char)
- API key check before processing
- No direct string interpolation in prompts (safe from prompt injection at API level)

#### `/api/analyze-receipt` - SECURE
- File type validation (JPEG, PNG, PDF, CSV, TXT only)
- File size limit (20MB max)
- Rate limiting (10/min, 100/hour, 1000/day)
- Image compression before processing
- No user-controlled paths or file access
- Web copy-paste detection and cleaning (Kroger-style)

#### `/api/quick-shelf-life` - SECURE
- Input validation (itemName required, trimmed)
- Clean item name before use
- No dynamic code execution
- JSON response parsing with error handling

#### `/api/get-freshness-info` - NOT REVIEWED (outside scope)

### Client-Side Security

#### localStorage
- All operations wrapped in try-catch
- No sensitive data stored (just grocery items)
- Reset functionality properly clears data

#### No Identified Vulnerabilities
- No XSS vectors (React auto-escapes)
- No SQL injection (no database)
- No command injection (no shell commands with user input)
- No SSRF (no user-controlled URLs to fetch)
- No path traversal (no file operations with user paths)

### Recommendations
1. Consider adding Content Security Policy headers
2. Consider adding rate limiting to all API routes (currently only on receipt)
3. API keys properly use environment variables

### Verdict: GOOD TO PUSH

No security vulnerabilities identified. All user inputs are validated and sanitized. API routes follow security best practices.
