/**
 * AI Rate Limiting Middleware
 *
 * Sliding-window rate limiter per authenticated user (or client IP fallback).
 * Default: 30 requests per 60-second window.
 */
const requestRecords = new Map();

// Periodic cleanup of expired records every 5 minutes
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of requestRecords.entries()) {
    const valid = timestamps.filter((t) => now - t < 60000);
    if (valid.length === 0) {
      requestRecords.delete(key);
    } else {
      requestRecords.set(key, valid);
    }
  }
}, 300000);
if (cleanupInterval.unref) cleanupInterval.unref();

function aiRateLimiter(maxRequests = 30, windowMs = 60000) {
  return (req, res, next) => {
    const identifier = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();

    const userTimestamps = requestRecords.get(identifier) || [];
    const recentRequests = userTimestamps.filter((t) => now - t < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'AI request limit reached. Please wait a moment before asking another question.',
        retryAfterSeconds: Math.ceil((windowMs - (now - recentRequests[0])) / 1000),
      });
    }

    recentRequests.push(now);
    requestRecords.set(identifier, recentRequests);
    next();
  };
}

module.exports = { aiRateLimiter };
