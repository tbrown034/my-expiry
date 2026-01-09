/**
 * Error handling utilities for Food Xpiry app
 * Provides user-friendly messages and developer-friendly logging
 */

// User-friendly error messages
export const ERROR_MESSAGES = {
  // API/Network errors
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  API_TIMEOUT: 'Request timed out. Please try again.',
  API_ERROR: 'Something went wrong. Please try again.',

  // Parse errors
  PARSE_ITEMS_FAILED: 'Could not understand the items. Please check the format and try again.',
  EMPTY_INPUT: 'Please enter at least one item.',

  // Shelf life errors
  SHELF_LIFE_FAILED: 'Could not get shelf life data. You can still add items manually.',
  API_KEY_MISSING: 'App is not configured properly. Please contact support.',

  // Receipt errors
  RECEIPT_UPLOAD_FAILED: 'Could not process receipt. Please try a clearer photo.',
  RECEIPT_TOO_LARGE: 'Image is too large. Please use a smaller file (max 20MB).',
  INVALID_FILE_TYPE: 'Invalid file type. Please use JPEG, PNG, or PDF.',

  // Storage errors
  STORAGE_FULL: 'Browser storage is full. Please delete some old items.',
  STORAGE_ERROR: 'Could not save data. Please try again.',

  // Generic
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

/**
 * Format error for user display
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred (e.g., 'parse-items', 'shelf-life')
 * @returns {string} User-friendly error message
 */
export function getUserFriendlyMessage(error, context = 'unknown') {
  // Check for specific error types
  if (error.message?.includes('credit balance') || error.message?.includes('billing')) {
    return 'API credits have run out. Please check your Anthropic account billing.';
  }

  if (error.message?.includes('API key') || error.message?.includes('ANTHROPIC_API_KEY')) {
    return ERROR_MESSAGES.API_KEY_MISSING;
  }

  if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
    return 'API authentication failed. Please check your API key configuration.';
  }

  if (error.message?.includes('network') || error.message?.includes('fetch failed')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (error.message?.includes('timeout')) {
    return ERROR_MESSAGES.API_TIMEOUT;
  }

  if (error.message?.includes('File too large')) {
    return ERROR_MESSAGES.RECEIPT_TOO_LARGE;
  }

  if (error.message?.includes('Invalid file type')) {
    return ERROR_MESSAGES.INVALID_FILE_TYPE;
  }

  if (error.message?.includes('No items provided') || error.message?.includes('empty')) {
    return ERROR_MESSAGES.EMPTY_INPUT;
  }

  // Context-specific defaults
  switch (context) {
    case 'parse-items':
      return ERROR_MESSAGES.PARSE_ITEMS_FAILED;
    case 'shelf-life':
      return ERROR_MESSAGES.SHELF_LIFE_FAILED;
    case 'receipt':
      return ERROR_MESSAGES.RECEIPT_UPLOAD_FAILED;
    case 'storage':
      return ERROR_MESSAGES.STORAGE_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}

/**
 * Log error for developers with context
 * @param {Error} error - The error object
 * @param {Object} context - Additional context information
 */
export function logError(error, context = {}) {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.group('🔴 Error Details');
    console.error('Message:', error.message);
    console.error('Context:', context);
    console.error('Stack:', error.stack);
    console.error('Time:', new Date().toISOString());
    console.groupEnd();
  } else {
    // In production, you'd send to error tracking service
    // Example: Sentry.captureException(error, { extra: context });
    console.error('Error:', error.message, context);
  }
}

/**
 * Create a standardized API error response
 * @param {string} message - User-friendly error message
 * @param {Error} error - The original error
 * @param {number} status - HTTP status code
 * @returns {Response} Next.js Response object
 */
export function createErrorResponse(message, error, status = 500) {
  const isDev = process.env.NODE_ENV === 'development';

  // Log for developers
  logError(error, { userMessage: message, status });

  // Return response with appropriate detail level
  return Response.json(
    {
      error: message,
      details: isDev ? error.message : undefined,
      stack: isDev ? error.stack : undefined,
    },
    { status }
  );
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in ms (will be exponentially increased)
 * @returns {Promise} Result of the function
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Validate and sanitize user input
 * @param {string} input - User input to validate
 * @param {Object} options - Validation options
 * @returns {Object} { isValid, sanitized, error }
 */
export function validateInput(input, options = {}) {
  const {
    maxLength = 10000,
    minLength = 1,
    required = true,
  } = options;

  // Check if required
  if (required && (!input || input.trim().length === 0)) {
    return {
      isValid: false,
      sanitized: null,
      error: ERROR_MESSAGES.EMPTY_INPUT,
    };
  }

  // Sanitize
  const sanitized = input?.trim() || '';

  // Check length
  if (sanitized.length < minLength || sanitized.length > maxLength) {
    return {
      isValid: false,
      sanitized: null,
      error: `Input must be between ${minLength} and ${maxLength} characters.`,
    };
  }

  return {
    isValid: true,
    sanitized,
    error: null,
  };
}
