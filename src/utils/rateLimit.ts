// Per-instance only: resets on cold start and does not hold across
// concurrent Vercel lambdas. This is a speed bump, not a guarantee.
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requestTimestamps = new Map<string, number[]>();

  return (key: string): boolean => {
    const now = Date.now();
    const timestamps = (requestTimestamps.get(key) ?? []).filter(
      (t) => now - t < windowMs
    );

    if (timestamps.length >= maxRequests) {
      requestTimestamps.set(key, timestamps);
      return true;
    }

    timestamps.push(now);
    requestTimestamps.set(key, timestamps);
    return false;
  };
};

export const getClientIp = (req: Request): string =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";
