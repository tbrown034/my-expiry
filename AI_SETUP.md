# AI Setup Guide for My Expiry

## Overview

My Expiry uses **Claude 3.5 Sonnet** from Anthropic to power intelligent grocery management features. This document explains how the AI integration works and how to set it up.

## Quick Setup

1. **Get an API Key**
   - Visit [Anthropic Console](https://console.anthropic.com/)
   - Sign up or log in
   - Navigate to API Keys
   - Create a new API key

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   ```

   Add your key to `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-...your-actual-key
   ```

3. **Restart Dev Server**
   ```bash
   npm run dev
   ```

## AI Features

### 1. Shelf Life Detection
**Endpoint**: `/api/get-shelf-life`

Determines how long food items will last from purchase date.

**Capabilities**:
- Single item analysis: `{ itemName: "milk" }`
- Batch processing: `{ itemNames: ["milk", "chicken", "bananas"] }`
- Parses complex inputs: "1 percent costco brand milk" → Name: "Milk", Modifier: "1% Fat, Costco Brand"
- Detects leftovers and adjusts shelf life (3-4 days for cooked food)
- Categorizes items (Dairy, Meat, Vegetables, Fruits, Bakery, Frozen, Pantry, Beverages, Other)
- Provides storage recommendations based on FDA/USDA guidelines

**Used By**:
- `AddGroceryForm.js` - Single item entry with "Use AI" toggle
- `BatchAddGroceryForm.js` - Multiple items at once
- `MainClient.js` - Core processing logic

### 2. Receipt Analysis
**Endpoint**: `/api/analyze-receipt`

Extracts grocery items from uploaded receipts.

**Supported Formats**:
- Images (JPEG, PNG, WebP) - Uses Claude's vision API
- PDF files - Extracts text with `pdf-parse` library
- CSV files - Direct text analysis
- Plain text files

**Extraction Details**:
- Item names (simplified to common names)
- Categories
- Shelf life estimates in days
- Storage recommendations
- Receipt date

**Used By**:
- `ReceiptUpload.js` - File upload component

### 3. Quick Shelf Life Lookup
**Endpoint**: `/api/quick-shelf-life`

Fast, conversational shelf life estimates for landing page demos.

**Returns**:
- Friendly 2-3 sentence answer
- Category classification
- Brief storage tips
- Estimated days until expiry

### 4. Freshness Analysis
**Endpoint**: `/api/get-freshness-info`

Analyzes your entire grocery inventory for detailed freshness guidance.

**Input**: Array of items with purchase/expiry dates

**Provides**:
- Variety-specific guidance (e.g., "Green bananas last longer than yellow ones")
- Safety vs quality distinctions
- Visual signs of spoilage
- Overall inventory tips

**Used By**:
- `MainClient.js` - `handleGetFreshnessInfo()` method

## AI Model Configuration

All endpoints use consistent settings:

| Endpoint | Model | Max Tokens | Purpose |
|----------|-------|------------|---------|
| Receipt Analysis | claude-3-5-sonnet-20241022 | 4000 | Complex document processing |
| Shelf Life | claude-3-5-sonnet-20241022 | 2000 | Item analysis |
| Quick Shelf Life | claude-3-5-sonnet-20241022 | 1000 | Fast responses |
| Freshness Info | claude-3-5-sonnet-20241022 | 3000 | Detailed inventory analysis |

## Data Flow

```
User Input (Text/Image/PDF/CSV)
        ↓
Frontend Component
        ↓
API Route Handler
        ↓
File Processing (if applicable)
  - PDFs: pdf-parse
  - Images: base64 encoding
  - Text/CSV: direct pass-through
        ↓
Claude API Call
        ↓
JSON Response Parsing
        ↓
Confirmation Modal (User Review)
        ↓
localStorage Persistence
        ↓
FoodInventory Display
```

## Error Handling

All API routes include:
- **API Key Validation**: Checks for `process.env.ANTHROPIC_API_KEY`
- **Try/Catch Wrapping**: Graceful error handling
- **Detailed Logging**: "🤖 AI TRIP" markers for debugging
- **User-Friendly Messages**: Clear error communication
- **Fallback Responses**: Prevents app crashes

Example error handling pattern:
```javascript
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY");
  return NextResponse.json(
    { error: 'AI service not configured' },
    { status: 500 }
  );
}
```

## Troubleshooting

### AI Features Not Working

**Problem**: Nothing happens when using AI features

**Solution**:
1. Check if `.env.local` exists in project root
2. Verify `ANTHROPIC_API_KEY` is set correctly
3. Check browser console for errors
4. Restart development server after adding API key
5. Verify API key is valid at [Anthropic Console](https://console.anthropic.com/)

### "AI service not configured" Error

**Problem**: API returns 500 error

**Cause**: Missing or invalid `ANTHROPIC_API_KEY`

**Solution**:
- Ensure `.env.local` file exists
- Confirm API key is correctly formatted: `sk-ant-api03-...`
- Restart dev server: `npm run dev`

### Receipt Upload Fails

**Problem**: Receipt analysis doesn't extract items

**Possible Causes**:
1. File format not supported (use JPG, PNG, PDF, TXT, CSV)
2. Image quality too low
3. API key missing/invalid
4. PDF is image-based (not text-based)

**Solution**:
- Try higher quality image
- Use text-based PDF or convert image PDFs to text
- Check console logs for specific errors

### Slow AI Responses

**Expected Behavior**: AI calls can take 2-10 seconds depending on:
- Request complexity (batch vs single item)
- Image processing (receipts)
- API response times

**Not a Bug**: This is normal for AI processing

## Development Tips

### Testing AI Locally

1. **Single Item Test**:
   ```javascript
   // Use AddGroceryForm with AI toggle enabled
   Input: "milk"
   Expected: Name: "Milk", Category: "Dairy", ~7 days shelf life
   ```

2. **Batch Test**:
   ```javascript
   // Use BatchAddGroceryForm
   Input: ["milk", "chicken", "bananas"]
   Expected: 3 items with individual shelf lives
   ```

3. **Leftover Detection**:
   ```javascript
   Input: "leftover pizza"
   Expected: Name: "Pizza", Modifier: "Leftover", ~3-4 days shelf life
   ```

### Monitoring AI Usage

Check console logs for:
```javascript
console.log(`Getting shelf life for ${cleanItems.length} items using Claude AI...`);
```

Look for "🤖 AI TRIP" markers in:
- `app/api/analyze-receipt/route.js:86, 153, 210, 269`

## Cost Considerations

Claude API usage is pay-per-use based on tokens:
- **Input tokens**: Text/images sent to Claude
- **Output tokens**: Text returned from Claude

**Typical Costs** (approximate):
- Single item shelf life: ~$0.001 per request
- Receipt analysis: ~$0.003-0.01 per image (varies by image size)
- Batch processing (10 items): ~$0.002 per request

**Cost Optimization**:
- Batch items when possible (more efficient than individual calls)
- Use Quick Shelf Life for simple lookups
- Monitor usage in Anthropic Console

## Security Best Practices

1. **Never Commit API Keys**
   - `.env.local` is gitignored by default
   - Never put keys in code or `.env.example`

2. **API Key Rotation**
   - Rotate keys periodically
   - Delete old keys in Anthropic Console

3. **Environment-Specific Keys**
   - Use different keys for development vs production
   - Set production keys via platform environment variables (Vercel, etc.)

## Production Deployment

### Vercel Deployment

1. **Set Environment Variable**:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `ANTHROPIC_API_KEY` = `your-production-key`
   - Select: Production, Preview, Development (as needed)

2. **Redeploy**:
   - Trigger new deployment for env vars to take effect

### Other Platforms

Set `ANTHROPIC_API_KEY` environment variable according to platform docs:
- **Netlify**: Site settings → Environment variables
- **AWS**: Lambda environment variables
- **Docker**: Pass via `-e` flag or compose file

## API Reference

### File Locations

```
/home/user/my-expiry/app/api/
├── analyze-receipt/route.js    # Receipt upload & analysis
├── get-shelf-life/route.js     # Main shelf life detection
├── quick-shelf-life/route.js   # Fast lookup for demos
└── get-freshness-info/route.js # Inventory freshness analysis
```

### Frontend Integration

```
/home/user/my-expiry/app/
├── components/
│   ├── AddGroceryForm.js        # Single item with AI toggle
│   ├── BatchAddGroceryForm.js   # Multiple items
│   └── ReceiptUpload.js         # File upload interface
└── MainClient.js                # Core integration logic
```

## Further Reading

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude Model Pricing](https://www.anthropic.com/pricing)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Food Safety Guidelines (FDA)](https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling)

## Support

If AI features still aren't working after following this guide:
1. Check browser console for errors
2. Check terminal logs for server errors
3. Verify API key at Anthropic Console
4. Create an issue with error details
