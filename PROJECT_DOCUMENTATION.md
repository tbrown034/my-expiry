# My Expiry - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Development Journey](#development-journey)
3. [Technical Challenges & Solutions](#technical-challenges--solutions)
4. [Design Philosophy](#design-philosophy)
5. [User Preferences & Constraints](#user-preferences--constraints)
6. [Current User Flows](#current-user-flows)
7. [Data Flow & API Integration](#data-flow--api-integration)
8. [Architecture Decisions](#architecture-decisions)
9. [Future Considerations](#future-considerations)

## Project Overview

My Expiry is a modern food tracking application that helps users manage grocery freshness, reduce food waste, and save money through AI-powered shelf life estimation. The application supports both guest tracking (local storage) and authenticated user experiences with cloud synchronization.

### Core Features
- AI-powered shelf life estimation
- Multiple input methods (single item, batch add, receipt scanning)
- Food categorization and expiry tracking
- Guest mode with local storage
- Responsive design with mobile-first approach
- Archived inventory system with cost analysis

## Development Journey

### Phase 1: Foundation & Initial UI
**Challenges:**
- Establishing consistent design system
- Implementing responsive layouts from scratch
- Setting up proper state management patterns

**Solutions:**
- Adopted Tailwind CSS with custom gradient system
- Implemented flexbox-first responsive approach
- Used React hooks with functional components throughout

### Phase 2: AI Integration & Confirmation Flow
**Challenges:**
- Complex AI confirmation modal with multiple states
- Handling AI response parsing and display
- Managing form state across multiple modals

**Solutions:**
- Created centralized confirmation system with `pendingAIResult`
- Implemented structured AI response handling
- Built reusable modal components with consistent UX

### Phase 3: Batch Processing & UX Improvements
**Major Challenge:** Initial batch add system was clunky with free-form textarea input leading to parsing errors and poor UX.

**Solution:** Complete redesign to modern tag-based input system:
- Enter/Tab key handling for adding items
- Visual tag representation with click-to-remove
- Comma-separated input support
- Real-time validation and duplicate prevention

### Phase 4: Category System Overhaul
**Challenge:** Storage-based categories (Pantry, Fridge, Freezer) weren't intuitive for users.

**Solution:** Migrated to food-based categories:
```javascript
export const Category = {
  FRUITS_VEGETABLES: 'Fruits & Vegetables',
  MEATS_CHEESES: 'Meats & Cheeses',
  DAIRY: 'Dairy',
  BEVERAGES: 'Beverages',
  FROZEN_FOODS: 'Frozen Foods',
  PANTRY: 'Pantry',
  OTHER: 'Other'
}
```

### Phase 5: Mobile Responsiveness & Visual Hierarchy
**Challenges:**
- Food cards were cluttered and hard to scan
- Status indicators were too subtle
- Mobile layouts were cramped

**Solutions:**
- Redesigned food cards with prominent, color-coded names
- Replaced thin borders with left vertical indicators + corner accents
- Implemented proper spacing with flexbox gaps
- Made food names the visual focus with status-based colors

### Phase 6: Archived System & Analytics
**Innovation:** Instead of deleting consumed/discarded items, implemented archival system:
- Items move to "Archived Inventory" when consumed/discarded
- AI-powered cost analysis comparing user habits to averages
- Historical tracking for accountability

## Technical Challenges & Solutions

### 1. State Management Complexity
**Challenge:** Managing multiple modal states, form data, and API responses.

**Solution:** Centralized state management with clear naming conventions:
```javascript
const [pendingAIResult, setPendingAIResult] = useState(null)
const [showConfirmModal, setShowConfirmModal] = useState(false)
const [aiConfirmLeftover, setAiConfirmLeftover] = useState(false)
```

### 2. LocalStorage vs Cloud Data Sync
**Challenge:** Seamless transition between guest and authenticated modes.

**Solution:** Abstracted storage layer with consistent API:
```javascript
const saveToLocalStorage = (newGroceries, newActivities, newArchived = archivedItems) => {
  localStorage.setItem('groceries', JSON.stringify(newGroceries))
  localStorage.setItem('activities', JSON.stringify(newActivities))
  localStorage.setItem('archivedItems', JSON.stringify(newArchived))
}
```

### 3. Real-time Expiry Calculations
**Challenge:** Keeping expiry status updated across components and time.

**Solution:** Centralized calculation functions with regular updates:
```javascript
const calculateDaysUntilExpiry = (expiryDate) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
}
```

### 4. Responsive Design Without Framework Dependencies
**Challenge:** Creating responsive layouts that work across all devices without relying on component libraries.

**Solution:** Tailwind CSS with consistent breakpoint strategy:
- Mobile-first design (`sm:`, `md:`, `lg:` breakpoints)
- Flexbox for all layouts with proper wrapping
- Consistent spacing system using `gap-*` utilities

## Design Philosophy

### Visual Hierarchy Principles
1. **Content First**: Food names are the primary focus with large, bold, colored text
2. **Status Communication**: Color coding that's immediately understandable (red=expired, green=fresh)
3. **Progressive Disclosure**: Important information visible, details available on demand
4. **Consistent Spacing**: Flexbox with gap utilities for predictable layouts

### Color System
- **Primary**: Emerald/Green gradient system for freshness theme
- **Status Colors**: Red (expired), Orange (expires today), Amber (expiring soon), Green (fresh)
- **Neutral**: Gray scale for secondary information
- **Accent**: Yellow for leftover indicators

### Interactive Elements
- **Immediate Feedback**: Hover states, loading spinners, visual confirmations
- **Accessibility**: Focus rings, keyboard navigation, semantic HTML
- **Mobile Optimization**: Touch-friendly targets, thumb-zone placement

## User Preferences & Constraints

### Technical Preferences
- **JavaScript**: Arrow functions preferred over function declarations
- **Styling**: Flexbox for all layouts, avoid CSS Grid complexity
- **Components**: Functional components with hooks only
- **State**: useState and useEffect, avoid complex state management libraries

### Design Constraints
- **No Emojis**: Clean, professional appearance without emoji clutter
- **Typography**: System fonts with proper hierarchy
- **Animations**: Subtle transitions, nothing distracting
- **Capitalization**: Consistent title case for all categories and food names

### UX Principles
- **Simplicity**: Reduce cognitive load, clear actions
- **Forgiveness**: Easy undo/edit, confirmation for destructive actions
- **Speed**: Fast interactions, minimal steps to complete tasks
- **Transparency**: Clear data storage information, no hidden behavior

## Current User Flows

### Guest User Flow
1. **Landing Page** → Choose "Start Tracking" → Guest Tracking Page
2. **Add Food** → Single Item → AI Confirmation → Inventory
3. **Add Multiple** → Tag-based Input → Batch Confirmation → Inventory
4. **Manage Items** → Consume/Discard → Archived Inventory
5. **View Analytics** → Cost Analysis → Conversion to Paid Account

### Authenticated User Flow
1. **Landing Page** → Sign In → Profile Dashboard
2. **Profile Actions** → Add Food / View Food → Full Feature Access
3. **Cloud Sync** → Data persistence across devices
4. **Premium Features** → Advanced analytics, notifications

### Food Item Lifecycle
```
Add Item → AI Processing → Confirmation Modal → Active Inventory
    ↓                                              ↓
Leftover Toggle                              Status Updates
    ↓                                              ↓
Consume/Discard → Archived Inventory → Cost Analysis
```

## Data Flow & API Integration

### Current API Endpoints

#### `/api/get-shelf-life` (POST)
**Purpose**: AI-powered shelf life estimation

**Request**:
```javascript
// Single item
{ itemName: "chicken breast" }

// Batch items
{ itemNames: ["chicken breast", "organic milk", "bananas"] }
```

**Response**:
```javascript
{
  name: "Chicken Breast",
  category: "Meats & Cheeses", 
  shelfLifeDays: 3,
  expiryDate: "2025-01-15",
  storageRecommendations: "Store in refrigerator...",
  originalInput: "chicken breast"
}
```

#### `/api/quick-shelf-life` (POST)
**Purpose**: Quick shelf life check for landing page

**Request**: `{ itemName: "leftover pizza" }`

**Response**:
```javascript
{
  name: "Leftover Pizza",
  answer: "Leftover pizza stays fresh for 3-4 days in the refrigerator...",
  storageRecommendations: "Store covered in refrigerator..."
}
```

#### `/api/cost-analysis` (POST) [Planned]
**Purpose**: Analyze user's food waste patterns

**Request**:
```javascript
{
  archivedItems: [...],
  activeItems: 12
}
```

**Response**:
```javascript
{
  analysis: "You're doing great! You've consumed 85% of your tracked items...",
  savings: "24.50",
  waste: "3.20"
}
```

### Data Storage Strategy

#### Local Storage (Guest Mode)
```javascript
localStorage.groceries = [
  {
    id: "uuid",
    name: "Chicken Breast",
    category: "Meats & Cheeses",
    purchaseDate: "2025-01-10",
    expiryDate: "2025-01-13",
    isLeftover: false,
    status: "fresh" | "expiring_soon" | "expired"
  }
]

localStorage.archivedItems = [
  {
    ...groceryItem,
    archivedDate: "2025-01-12",
    archivedStatus: "consumed" | "discarded"
  }
]

localStorage.activities = [
  {
    id: "uuid",
    type: "added" | "consumed" | "wasted",
    action: "Added",
    item: "Chicken Breast",
    time: "2025-01-10T10:30:00Z"
  }
]
```

#### Cloud Storage (Authenticated)
- Same data structure as localStorage
- Synced via user authentication system
- Backup and cross-device synchronization

## Architecture Decisions

### Component Structure
```
/app
  /components
    - Modular, reusable components
    - Single responsibility principle
    - Props-based communication
  /tracking
    - page.js (main tracking interface)
  /profile  
    - page.js (authenticated user dashboard)
  /auth
    - Authentication flow
```

### State Management Pattern
- **Local State**: useState for component-specific data
- **Derived State**: Computed values from base state
- **Side Effects**: useEffect for data loading and persistence
- **No Global State**: Avoided Redux/Context for simplicity

### Styling Approach
- **Tailwind CSS**: Utility-first for consistency
- **Flexbox Layout**: Primary layout method
- **Responsive Design**: Mobile-first breakpoints
- **Custom Components**: Reusable UI patterns

### Error Handling
- **Try/catch**: API calls wrapped with error handling
- **User Feedback**: Toast notifications for all operations
- **Graceful Degradation**: Fallbacks for failed operations
- **Validation**: Input validation before API calls

## Future Considerations

### Technical Debt
1. **API Integration**: Complete cost analysis endpoint implementation
2. **Testing**: Add comprehensive unit and integration tests
3. **Performance**: Implement virtual scrolling for large inventories
4. **PWA**: Add service worker for offline functionality

### Feature Enhancements
1. **Smart Notifications**: Browser notifications for expiring items
2. **Recipe Suggestions**: AI-powered meal recommendations from inventory
3. **Shopping Lists**: Generate lists based on consumption patterns
4. **Social Features**: Share inventories with family members

### Scalability Concerns
1. **Database Migration**: Plan for localStorage → cloud database transition
2. **API Rate Limiting**: Implement proper throttling for AI calls
3. **Image Storage**: Add support for food photos
4. **Analytics**: Comprehensive user behavior tracking

---

*Documentation last updated: January 2025*
*Project status: MVP Complete, Feature Enhancement Phase*