# Food Xpiry - Smart Grocery Expiration Tracker

A Next.js application that helps reduce food waste by tracking grocery expiration dates with AI-powered shelf-life estimates.

**Live Demo**: [my-expiry.vercel.app](https://my-expiry.vercel.app)

## Features

- **AI-Powered Shelf Life Estimates**: Get intelligent expiration predictions based on food type and storage method
- **Receipt Scanning**: Snap a photo of your grocery receipt to bulk-add items
- **Batch Item Processing**: Add multiple items at once with automatic parsing
- **Visual Fridge Interface**: Intuitive "fridge door" metaphor with sticky-note organization
- **Storage Tips**: Receive personalized tips to extend food freshness
- **Local Storage**: All data stored locally - no account required

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: GSAP + Framer Motion (motion/react)
- **AI**: OpenAI API for shelf-life estimates and receipt parsing
- **Storage**: localStorage (client-side persistence)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/tbrown034/food-xpiry.git
cd food-xpiry

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/
├── components/       # React components
│   ├── svg/          # SVG icon components (Magnet, FridgeHandle, etc.)
│   └── ...           # UI components
├── api/              # API routes for AI features
│   ├── get-shelf-life/
│   ├── parse-items/
│   └── analyze-receipt/
lib/
├── storage.js        # localStorage wrapper with error handling
├── utils.js          # Utility functions
├── motionVariants.js # Framer Motion animation presets
└── gsapAnimations.js # GSAP animation helpers
```

## Architecture Highlights

- **State Management**: Uses `useReducer` for consolidated modal state, reducing useState calls by 60%
- **Animation System**: GSAP for complex timelines, Framer Motion for component transitions
- **Error Handling**: Comprehensive try-catch for localStorage operations
- **Responsive Design**: Mobile-first with dynamic viewport units (`dvh`)

## License

MIT
