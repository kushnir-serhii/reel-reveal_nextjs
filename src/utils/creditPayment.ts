import "server-only";

import Stripe from "stripe";
import { addCreditsForPayment } from "@/db/services/aiQuota";

// Adds the purchased AI credits for a succeeded PaymentIntent. Safe to call
// more than once for the same payment.
export const creditPayment = async (
  paymentIntent: Stripe.PaymentIntent
): Promise<boolean> => {
  if (paymentIntent.status !== "succeeded") return false;

  const userId = paymentIntent.metadata?.userId;
  const credits = Number(paymentIntent.metadata?.credits);

  return addCreditsForPayment(userId, paymentIntent.id, credits);
};
