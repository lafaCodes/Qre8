/**
 * Client-side rate limiting utility
 * Uses localStorage to track request counts per action
 * This is a soft limit - real protection should be at Cloudflare level
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const STORAGE_KEY = "qre8_rate_limits";

// Default rate limit configurations
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // QR code generation: 60 per hour
  generate: {
    maxRequests: 60,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // Downloads: 30 per hour
  download: {
    maxRequests: 30,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // Burst protection: 10 per minute for any action
  burst: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
};

/**
 * Get current rate limit data from localStorage
 */
function getRateLimitData(): Record<string, RateLimitEntry> {
  if (typeof window === "undefined") return {};
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};
    return JSON.parse(data);
  } catch {
    return {};
  }
}

/**
 * Save rate limit data to localStorage
 */
function saveRateLimitData(data: Record<string, RateLimitEntry>): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or disabled
  }
}

/**
 * Check if an action is rate limited
 * Returns { allowed: boolean, remaining: number, resetIn: number }
 */
export function checkRateLimit(action: keyof typeof RATE_LIMITS): {
  allowed: boolean;
  remaining: number;
  resetIn: number; // milliseconds until reset
} {
  const config = RATE_LIMITS[action];
  if (!config) {
    return { allowed: true, remaining: Infinity, resetIn: 0 };
  }

  const now = Date.now();
  const data = getRateLimitData();
  const entry = data[action];

  // If no entry or window expired, allow and reset
  if (!entry || now >= entry.resetTime) {
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetIn: config.windowMs,
    };
  }

  // Check if limit exceeded
  const remaining = config.maxRequests - entry.count;
  const resetIn = entry.resetTime - now;

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    resetIn,
  };
}

/**
 * Record an action (increment counter)
 * Call this after successfully performing the action
 */
export function recordAction(action: keyof typeof RATE_LIMITS): void {
  const config = RATE_LIMITS[action];
  if (!config) return;

  const now = Date.now();
  const data = getRateLimitData();
  const entry = data[action];

  // Reset if window expired
  if (!entry || now >= entry.resetTime) {
    data[action] = {
      count: 1,
      resetTime: now + config.windowMs,
    };
  } else {
    data[action] = {
      count: entry.count + 1,
      resetTime: entry.resetTime,
    };
  }

  saveRateLimitData(data);
}

/**
 * Check and record an action in one call
 * Returns the rate limit status
 */
export function consumeRateLimit(action: keyof typeof RATE_LIMITS): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  // First check burst limit
  const burstCheck = checkRateLimit("burst");
  if (!burstCheck.allowed) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: burstCheck.resetIn,
    };
  }

  // Then check action-specific limit
  const actionCheck = checkRateLimit(action);
  if (!actionCheck.allowed) {
    return actionCheck;
  }

  // Record both burst and action
  recordAction("burst");
  if (action !== "burst") {
    recordAction(action);
  }

  return {
    allowed: true,
    remaining: actionCheck.remaining - 1,
    resetIn: actionCheck.resetIn,
  };
}

/**
 * Format remaining time for display
 */
export function formatResetTime(ms: number): string {
  if (ms <= 0) return "now";
  
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  
  const hours = Math.ceil(minutes / 60);
  return `${hours}h`;
}

/**
 * Get rate limit status message
 */
export function getRateLimitMessage(action: keyof typeof RATE_LIMITS): string | null {
  const status = checkRateLimit(action);
  
  if (!status.allowed) {
    return `Rate limit exceeded. Try again in ${formatResetTime(status.resetIn)}.`;
  }
  
  // Warn when getting close to limit (20% remaining)
  const config = RATE_LIMITS[action];
  if (config && status.remaining <= config.maxRequests * 0.2) {
    return `${status.remaining} ${action}s remaining this hour.`;
  }
  
  return null;
}

/**
 * Clear all rate limit data (for testing/debugging)
 */
export function clearRateLimits(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
