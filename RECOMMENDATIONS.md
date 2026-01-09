# Food Xpiry - Technical Recommendations

**Date**: 2026-01-09
**Based on**: Code audit, test results, API research, Anthropic best practices

---

## Executive Summary

After comprehensive analysis of the Food Xpiry codebase, testing the emoji matching system, and researching current best practices, here are prioritized recommendations to improve accuracy, reduce costs, and enhance the user experience.

### Current State
- **Emoji Matching Accuracy**: 89.5% (111/124 tests passed)
- **AI Models**: Claude Sonnet 4.5 (20250929) + Claude 3.5 Sonnet (20241022)
- **Food Database**: ~120 items hardcoded from USDA FoodKeeper
- **Advanced Features Used**: Tool calling, prompt caching, extended thinking, structured outputs

---

## 1. Emoji Matching Improvements

### Test Results Analysis

**13 Failed Tests** revealed these patterns:

| Issue | Example | Root Cause |
|-------|---------|------------|
| "Frozen" matches first | "Frozen Pizza DiGiorno" → 🧊 | Keyword order issue |
| Abbreviations not matched | "chkn brst" → falls back | No abbreviation handling |
| Missing keywords | "Franks" → 🥩 (should be 🌭) | Incomplete keyword list |
| "Apple" in non-fruit | "Apple Cider Vinegar" → 🍎 | Context not considered |

### Recommended Fixes

#### A. Move "frozen" keyword to lower priority
```javascript
// In foodEmojis.js - move frozen to end of keywords list
// OR add compound phrases for common frozen items
const compoundPhrases = {
  'frozen pizza': '🍕',
  'frozen mango': '🥭',
  'frozen chicken': '🍗',
  // ... etc
};
```

#### B. Add common abbreviations
```javascript
const abbreviationMap = {
  'chkn': 'chicken',
  'brst': 'breast',
  'bnls': 'boneless',
  'sknls': 'skinless',
  'org': 'organic',
  'whl': 'whole',
  'gal': 'gallon',
  'dz': 'dozen',
  'ct': 'count',
  'lb': 'pound',
  'oz': 'ounce',
};

// Expand abbreviations before matching
function expandAbbreviations(name) {
  let expanded = name.toLowerCase();
  for (const [abbr, full] of Object.entries(abbreviationMap)) {
    expanded = expanded.replace(new RegExp(`\\b${abbr}\\b`, 'g'), full);
  }
  return expanded;
}
```

#### C. Add missing keywords
```javascript
// Hot dogs / franks
franks: '🌭',
frankfurter: '🌭',
wiener: '🌭',

// More specialty items
hummus: '🥙',
tofu: '🥡',
kimchi: '🥬',
miso: '🍜',
```

#### D. Consider AI-powered emoji matching (optional)
For unknown items, use Claude to suggest an emoji:
```javascript
// Fallback to AI for truly unknown items
async function getAIEmoji(itemName) {
  // Call Claude with: "What single emoji best represents: {itemName}?"
  // Cache results to avoid repeated API calls
}
```

---

## 2. Anthropic API Best Practices

### Current Implementation ✅
Your codebase already implements most best practices:
- [x] Tool calling for structured data lookup
- [x] Prompt caching (90% cost reduction)
- [x] Extended thinking for complex decisions
- [x] Structured outputs for guaranteed JSON
- [x] Image compression for receipt analysis

### Recommended Upgrades

#### A. Upgrade to Latest Structured Outputs Beta
```javascript
// Add the new beta header (released Nov 2025)
headers: {
  'anthropic-beta': 'structured-outputs-2025-11-13'
}
```

This guarantees schema compliance at the token generation level, not just prompting.

**Source**: [Anthropic Structured Outputs Docs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)

#### B. Consider Advanced Tool Use Features (Beta)
Three new features available:
1. **Tool Search Tool** - Access thousands of tools without context window bloat
2. **Programmatic Tool Calling** - Invoke tools in code execution environment
3. **Tool Use Examples** - Standardized way to demonstrate tool usage

```javascript
// Enable with beta header
headers: {
  'anthropic-beta': 'advanced-tool-use-2025-11-20'
}
```

**Source**: [Anthropic Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use)

#### C. Model Version Updates
Current versions in codebase:
- `claude-sonnet-4-5-20250929` ✅ (good)
- `claude-3-5-sonnet-20241022` ⚠️ (could upgrade to claude-3-5-sonnet-20250130 if available)

Check the [Claude Models page](https://docs.anthropic.com/en/docs/about-claude/models) for latest versions.

---

## 3. External Food Database Integration

### Current State
- ~120 foods hardcoded in `/api/get-shelf-life/route.js`
- Source: USDA FoodKeeper (manually copied)
- Coverage: Basic items only

### Recommended: Use Official USDA FoodKeeper Data Feed

**Available at**: [catalog.data.gov/dataset/fsis-foodkeeper-data](https://catalog.data.gov/dataset/fsis-foodkeeper-data)

**Benefits**:
- 500+ food items (vs 120 hardcoded)
- Official USDA shelf life data
- CC0 license (public domain)
- JSON format ready to use
- Regular updates from USDA

**Implementation**:
```javascript
// Option A: Static import (recommended for now)
// Download JSON, place in /lib/data/foodkeeper.json
import foodkeeperData from '../data/foodkeeper.json';

// Option B: Runtime fetch with caching
// Fetch at build time, cache for 24 hours
```

**Download Links**:
- English JSON: `https://www.fsis.usda.gov/shared/data/EN/foodkeeper.json`

### Also Consider: FoodData Central API

For nutritional data (if needed later):
- **API Docs**: [fdc.nal.usda.gov/api-guide](https://fdc.nal.usda.gov/api-guide/)
- **Open Source Implementation**: [github.com/littlebunch/fdc-api](https://github.com/littlebunch/fdc-api)
- Requires free API key from data.gov

---

## 4. Architecture Recommendations

### A. Centralize Food Data

Create a unified food database service:

```
lib/
├── data/
│   ├── foodkeeper.json          # USDA FoodKeeper data (500+ items)
│   └── foodEmojis.js            # Emoji mappings
├── services/
│   └── foodDatabase.js          # Unified API for food lookups
```

```javascript
// lib/services/foodDatabase.js
import foodkeeperData from '../data/foodkeeper.json';
import { getFoodEmoji } from '../data/foodEmojis';

export class FoodDatabase {
  // Lookup shelf life
  getShelfLife(itemName, category) { ... }

  // Get emoji
  getEmoji(itemName, category) { ... }

  // Search foods
  searchFoods(query) { ... }

  // AI fallback for unknown items
  async getAIEstimate(itemName) { ... }
}
```

### B. Improve Rate Limiting

Current: In-memory (resets on restart)

Recommended:
```javascript
// For production: Use Vercel KV or Redis
import { kv } from '@vercel/kv';

// Or simple file-based for smaller scale
import { LRUCache } from 'lru-cache';
```

### C. Add Food Data Caching

Cache AI-generated shelf life estimates:
```javascript
// When Claude estimates shelf life for unknown item:
// 1. Store in cache/database
// 2. Next time same item appears, use cached value
// 3. Periodically review/verify cached estimates
```

---

## 5. Priority Action Items

### High Priority (Do Now)

| Item | Effort | Impact |
|------|--------|--------|
| Fix "frozen" keyword priority | 15 min | +3% accuracy |
| Add missing keywords (franks, hummus, tofu) | 30 min | +2% accuracy |
| Add common abbreviations map | 1 hour | Better receipt parsing |
| Download USDA FoodKeeper JSON | 30 min | 4x more food items |

### Medium Priority (This Week)

| Item | Effort | Impact |
|------|--------|--------|
| Upgrade to structured-outputs-2025-11-13 | 1 hour | Guaranteed JSON |
| Create FoodDatabase service class | 2 hours | Cleaner architecture |
| Add emoji matching tests to CI | 1 hour | Prevent regressions |

### Low Priority (Future)

| Item | Effort | Impact |
|------|--------|--------|
| AI-powered emoji fallback | 4 hours | Handle edge cases |
| FoodData Central integration | 8 hours | Nutritional data |
| User feedback on emoji accuracy | 4 hours | Continuous improvement |

---

## 6. Test Suite Summary

**Location**: `/lib/__tests__/foodEmoji.test.js`

**Coverage**: 10 test sets, 124 items total

| Test Set | Items | Description |
|----------|-------|-------------|
| Basic Grocery Run | 12 | Common items |
| Deli Counter Items | 8 | Deli meats/cheeses |
| Kroger Online Order | 20 | Real receipt format |
| Restaurant Leftovers | 6 | Takeout containers |
| Prepared Foods | 10 | Hot bar/deli |
| Seafood | 7 | Fish counter |
| Breakfast Items | 9 | Morning staples |
| International/Specialty | 15 | Edge cases |
| Snacks & Beverages | 8 | Packaged goods |
| Edge Cases | 10 | Tricky inputs |

**Run Tests**:
```bash
npm test -- lib/__tests__/foodEmoji.test.js
```

**Current Results**: 111 passed, 13 failed (89.5% accuracy)

**Target**: 95% accuracy after implementing fixes

---

## Sources

- [Anthropic Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Anthropic Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use)
- [USDA FoodKeeper Data](https://catalog.data.gov/dataset/fsis-foodkeeper-data)
- [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide/)
- [Claude API Best Practices Guide](https://www.spurnow.com/en/blogs/claude-api-guide)
