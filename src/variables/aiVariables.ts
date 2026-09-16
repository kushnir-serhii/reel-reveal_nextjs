// Free AI requests per UTC day, shared by the quiz and the chat.
export const AI_DAILY_LIMIT_GUEST = 1;
export const AI_DAILY_LIMIT_USER = 5;

// One-time purchase, spent only after the free daily requests run out.
export const AI_CREDIT_PACK = {
  credits: 100,
  amount: 500,
  currency: "eur",
} as const;

export const AI_LIMIT_CODES = {
  loginRequired: "LOGIN_REQUIRED",
  noCredits: "NO_CREDITS",
  rateLimited: "RATE_LIMITED",
} as const;

// Chat input caps, so nobody pastes a book into the prompt.
export const AI_CHAT_MAX_MESSAGE_LENGTH = 500;
export const AI_CHAT_MAX_MESSAGES = 10;
export const AI_CHAT_MAX_HISTORY_LENGTH = 3000;
export const AI_MAX_BODY_BYTES = 16 * 1024;
