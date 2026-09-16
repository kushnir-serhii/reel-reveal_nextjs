import "server-only";

import { createHash } from "crypto";
import { connectDB } from "@/db/db";
import AiUsage from "@/db/models/aiUsage";
import User from "@/db/models/user";
import { AiQuota, ISessionUser } from "@/typification";
import { AI_DAILY_LIMIT_GUEST, AI_DAILY_LIMIT_USER } from "@/variables";

export type AiRequestSource = "daily" | "credit";

type Subject = { key: string; userId: string; dailyLimit: number };

const getSubject = (sessionUser: ISessionUser, ip: string): Subject =>
  sessionUser.userId
    ? {
        key: `user:${sessionUser.userId}`,
        userId: sessionUser.userId,
        dailyLimit: AI_DAILY_LIMIT_USER,
      }
    : {
        // Guests are counted by IP so clearing cookies doesn't reset the limit.
        key: `ip:${createHash("sha256").update(ip).digest("hex")}`,
        userId: "",
        dailyLimit: AI_DAILY_LIMIT_GUEST,
      };

const today = () => new Date().toISOString().slice(0, 10);

// Keep the row a day past its UTC day, then let the TTL index drop it.
const expiryFor = (day: string) =>
  new Date(Date.parse(`${day}T00:00:00Z`) + 2 * 24 * 60 * 60 * 1000);

let indexesReady: Promise<unknown> | null = null;

const connect = async () => {
  await connectDB();
  indexesReady ??= AiUsage.init();
  await indexesReady;
};

const getCredits = async (userId: string): Promise<number> => {
  if (!userId) return 0;
  const user = await User.findById(userId, { aiCredits: 1 }).lean<{
    aiCredits?: number;
  }>();
  return user?.aiCredits ?? 0;
};

export const getAiQuota = async (
  sessionUser: ISessionUser,
  ip: string
): Promise<AiQuota> => {
  await connect();
  const { key, userId, dailyLimit } = getSubject(sessionUser, ip);

  const [usage, credits] = await Promise.all([
    AiUsage.findOne({ key, day: today() }, { count: 1, tokens: 1 }).lean(),
    getCredits(userId),
  ]);
  const dailyUsed = Math.min(usage?.count ?? 0, dailyLimit);

  return {
    isGuest: !userId,
    dailyLimit,
    dailyUsed,
    credits,
    remaining: dailyLimit - dailyUsed + credits,
    tokensToday: usage?.tokens ?? 0,
  };
};

// Spends one free daily request, or one paid credit once those run out.
// Returns null when neither is available.
export const consumeAiRequest = async (
  sessionUser: ISessionUser,
  ip: string
): Promise<AiRequestSource | null> => {
  await connect();
  const { key, userId, dailyLimit } = getSubject(sessionUser, ip);
  const day = today();

  try {
    // When the row is already at the limit, the filter misses, the upsert
    // tries to insert a duplicate (key, day) and the unique index rejects it.
    await AiUsage.findOneAndUpdate(
      { key, day, count: { $lt: dailyLimit } },
      { $inc: { count: 1 }, $setOnInsert: { expireAt: expiryFor(day) } },
      { upsert: true }
    );
    return "daily";
  } catch (error: any) {
    if (error?.code !== 11000) throw error;
  }

  if (!userId) return null;

  const user = await User.findOneAndUpdate(
    { _id: userId, aiCredits: { $gt: 0 } },
    { $inc: { aiCredits: -1 } },
    { projection: { _id: 1 } }
  );
  return user ? "credit" : null;
};

// Gives back a request whose AI call failed, so errors don't cost the user.
export const refundAiRequest = async (
  sessionUser: ISessionUser,
  ip: string,
  source: AiRequestSource
): Promise<void> => {
  await connect();
  const { key, userId } = getSubject(sessionUser, ip);

  if (source === "credit") {
    await User.updateOne({ _id: userId }, { $inc: { aiCredits: 1 } });
  } else {
    await AiUsage.updateOne(
      { key, day: today(), count: { $gt: 0 } },
      { $inc: { count: -1 } }
    );
  }
};

export const recordAiTokens = async (
  sessionUser: ISessionUser,
  ip: string,
  tokens: number
): Promise<void> => {
  if (!(tokens > 0)) return;
  await connect();
  const { key } = getSubject(sessionUser, ip);
  const day = today();

  await AiUsage.updateOne(
    { key, day },
    { $inc: { tokens }, $setOnInsert: { expireAt: expiryFor(day) } },
    { upsert: true }
  );
};

// Idempotent: the same PaymentIntent adds credits only once, whether it
// arrives through the webhook or the success page.
export const addCreditsForPayment = async (
  userId: string,
  paymentIntentId: string,
  credits: number
): Promise<boolean> => {
  if (!userId || !paymentIntentId || !(credits > 0)) return false;
  await connect();

  const result = await User.updateOne(
    { _id: userId, paidIntents: { $ne: paymentIntentId } },
    {
      $inc: { aiCredits: credits },
      $push: { paidIntents: paymentIntentId },
    }
  );
  return result.modifiedCount === 1;
};
