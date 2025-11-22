# Image Processing with Claude API - Best Practices (Nov 2025)

## 📊 Current Status of Your Receipt Scanning

### What You're Already Doing Right ✅
- Using Claude Sonnet 4.5 (latest model)
- Prompt caching for 90% cost reduction
- Extended thinking for better accuracy
- Structured outputs for guaranteed JSON
- Multi-format support (images, PDFs)

### What Needs Improvement ⚠️
- No file size limits
- No image compression
- No rate limiting
- No dimension validation
- No cost tracking

---

## 💡 How Image APIs Work (Teaching Section)

### Image Pricing Model
Claude charges for images based on **resolution**, not just file size:

```
Small images (≤1024px shortest side):  ~1,000 tokens
Large images (>1024px):                 ~2,000+ tokens + tile-based pricing
```

**Example Receipt Costs:**
```javascript
// Uncompressed smartphone photo
3000x4000px receipt = ~3,000 tokens = $0.009-0.015/receipt

// Optimized receipt
800x1200px receipt  = ~1,000 tokens = $0.003-0.005/receipt
                                      ↑ 60-70% cheaper!
```

### How Images are Sent to Claude

```javascript
// Method 1: Base64 (what you're using)
{
  type: "image",
  source: {
    type: "base64",
    media_type: "image/jpeg",
    data: "iVBORw0KGgoAAAANS..." // Base64 string
  }
}

// Method 2: URL (for images already hosted)
{
  type: "image",
  source: {
    type: "url",
    url: "https://example.com/receipt.jpg"
  }
}
```

**Your implementation uses Base64** (line 297 in route.js), which is correct for user uploads.

---

## 🚀 Recommended Implementation

### 1. File Size & Type Validation

```javascript
const RECEIPT_LIMITS = {
  MAX_FILE_SIZE: 20 * 1024 * 1024,  // 20MB
  MAX_IMAGE_DIMENSION: 4096,         // pixels
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'text/csv',
    'text/plain'
  ]
};

function validateFile(file) {
  // Size check
  if (file.size > RECEIPT_LIMITS.MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size is 20MB`);
  }

  // Type check
  const isImage = RECEIPT_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type);
  const isDoc = RECEIPT_LIMITS.ALLOWED_DOCUMENT_TYPES.includes(file.type);

  if (!isImage && !isDoc) {
    throw new Error('Invalid file type. Use JPEG, PNG, PDF, or text');
  }

  return { isImage, isDoc };
}
```

### 2. Image Compression (CRITICAL for Cost Savings)

```javascript
// Install: npm install sharp
import sharp from 'sharp';

async function compressReceiptImage(imageBuffer, mediaType) {
  const TARGET_HEIGHT = 1200; // Good balance for receipt OCR
  const JPEG_QUALITY = 85;    // High quality, good compression

  try {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    console.log(`📐 Original: ${metadata.width}x${metadata.height}`);

    // Resize if too large
    let processedImage = image;
    if (metadata.height > TARGET_HEIGHT) {
      processedImage = image.resize(null, TARGET_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Convert to JPEG for better compression
    const compressed = await processedImage
      .jpeg({ quality: JPEG_QUALITY })
      .toBuffer();

    const compressionRatio = ((imageBuffer.length - compressed.length) / imageBuffer.length * 100).toFixed(1);
    console.log(`✅ Compressed: ${compressed.length} bytes (${compressionRatio}% smaller)`);

    return {
      data: compressed.toString('base64'),
      mediaType: 'image/jpeg',
      originalSize: imageBuffer.length,
      compressedSize: compressed.length
    };

  } catch (error) {
    console.error('Compression failed, using original:', error);
    return {
      data: imageBuffer.toString('base64'),
      mediaType,
      originalSize: imageBuffer.length,
      compressedSize: imageBuffer.length
    };
  }
}
```

### 3. Rate Limiting (Per User)

```javascript
// Simple in-memory rate limiter (production: use Redis)
const rateLimits = new Map();

const RATE_LIMITS = {
  WINDOW_MS: 60 * 1000,      // 1 minute
  MAX_REQUESTS: 10,           // 10 receipts per minute
  MAX_PER_HOUR: 100,          // 100 per hour
  MAX_PER_DAY: 1000           // 1000 per day
};

function checkRateLimit(userId = 'anonymous') {
  const now = Date.now();
  const userKey = `receipt:${userId}`;

  if (!rateLimits.has(userKey)) {
    rateLimits.set(userKey, {
      requests: [],
      hourlyCount: 0,
      dailyCount: 0,
      hourReset: now + 3600000,
      dayReset: now + 86400000
    });
  }

  const userData = rateLimits.get(userKey);

  // Clean old requests (older than 1 minute)
  userData.requests = userData.requests.filter(
    time => now - time < RATE_LIMITS.WINDOW_MS
  );

  // Check limits
  if (userData.requests.length >= RATE_LIMITS.MAX_REQUESTS) {
    throw new Error('Rate limit exceeded. Please wait before uploading more receipts.');
  }

  if (userData.hourlyCount >= RATE_LIMITS.MAX_PER_HOUR) {
    throw new Error('Hourly limit reached. Please try again later.');
  }

  // Add current request
  userData.requests.push(now);
  userData.hourlyCount++;
  userData.dailyCount++;

  // Reset hourly/daily counters
  if (now > userData.hourReset) {
    userData.hourlyCount = 0;
    userData.hourReset = now + 3600000;
  }
  if (now > userData.dayReset) {
    userData.dailyCount = 0;
    userData.dayReset = now + 86400000;
  }

  return {
    remaining: RATE_LIMITS.MAX_REQUESTS - userData.requests.length,
    resetAt: userData.hourReset
  };
}
```

### 4. Cost Tracking & Logging

```javascript
function logAPIUsage(file, message, compressed = null) {
  const usage = {
    timestamp: new Date().toISOString(),
    fileType: file.type,
    fileName: file.name,
    originalSize: file.size,
    compressedSize: compressed?.compressedSize,
    inputTokens: message.usage?.input_tokens || 0,
    outputTokens: message.usage?.output_tokens || 0,
    cacheReadTokens: message.usage?.cache_read_input_tokens || 0,
    cacheCreationTokens: message.usage?.cache_creation_input_tokens || 0,
    thinkingTokens: message.usage?.thinking_tokens || 0
  };

  // Calculate estimated cost (Claude Sonnet 4.5 pricing Nov 2025)
  const INPUT_COST = 3 / 1000000;   // $3 per 1M tokens
  const OUTPUT_COST = 15 / 1000000; // $15 per 1M tokens
  const CACHE_COST = 0.3 / 1000000; // $0.30 per 1M tokens (90% discount)

  const cost = (
    (usage.inputTokens * INPUT_COST) +
    (usage.outputTokens * OUTPUT_COST) +
    (usage.cacheReadTokens * CACHE_COST)
  );

  usage.estimatedCost = cost.toFixed(6);
  usage.compressionSavings = compressed
    ? `${((compressed.originalSize - compressed.compressedSize) / compressed.originalSize * 100).toFixed(1)}%`
    : 'N/A';

  console.log('💰 API Usage:', JSON.stringify(usage, null, 2));

  // In production: Send to analytics/logging service
  return usage;
}
```

---

## 📦 Complete Enhanced Route Example

```javascript
export async function POST(request) {
  try {
    // 1. Extract and validate file
    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId") || 'anonymous';

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. Rate limiting
    try {
      const rateLimit = checkRateLimit(userId);
      console.log(`✅ Rate limit OK (${rateLimit.remaining} remaining)`);
    } catch (rateLimitError) {
      return NextResponse.json(
        { error: rateLimitError.message },
        { status: 429 }
      );
    }

    // 3. Validate file
    const { isImage } = validateFile(file);

    // 4. Extract content
    let extractedData = await extractFileContent(file);

    // 5. Compress images
    let compressed = null;
    if (isImage) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      compressed = await compressReceiptImage(buffer, file.type);
      extractedData.content = compressed.data;
      extractedData.mediaType = compressed.mediaType;
    }

    // 6. AI Analysis (your existing code)
    const message = await anthropic.messages.create({
      // ... your existing config
    });

    // 7. Log usage
    logAPIUsage(file, message, compressed);

    // 8. Return results
    return NextResponse.json({
      // ... your existing response
      meta: {
        compressionSavings: compressed?.compressionSavings,
        tokensUsed: message.usage?.input_tokens + message.usage?.output_tokens,
        cached: message.usage?.cache_read_input_tokens > 0
      }
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 🎯 Priority Recommendations

### Immediate (Do Now):
1. ✅ **Add file size validation** (20MB limit)
2. ✅ **Install and use `sharp`** for image compression
3. ✅ **Add rate limiting** (10/min, 100/hour)

### Important (This Week):
4. 📊 Add cost tracking/logging
5. 🖼️ Validate image dimensions
6. 🔒 Add user authentication for rate limiting

### Nice to Have:
7. 📈 Dashboard to monitor API costs
8. 🎨 Client-side image preview before upload
9. 🔄 Retry logic for failed requests

---

## 💡 Key Learnings

### Images vs Text Tokens:
- **Text**: "milk" = 1 token
- **Small image** (800x1200): ~1,000 tokens
- **Large image** (3000x4000): ~3,000 tokens

### Cost Optimization Strategies:
1. **Compress images** → 60-70% savings
2. **Prompt caching** → 90% savings (you're already doing this!)
3. **Rate limiting** → Prevents abuse/surprises
4. **Structured outputs** → No retry costs (you're doing this!)

### Your Current Setup is 8/10:
- ✅ Using best model
- ✅ Caching enabled
- ✅ Extended thinking
- ✅ Structured outputs
- ❌ No compression
- ❌ No rate limits

**With compression + limits: 10/10!**
