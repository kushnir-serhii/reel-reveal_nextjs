import { redirect } from "next/navigation";
import CheckoutForm from "@/app/components/checkout/Checkout";
import { stripe } from "@/utils/stripe";
import { getSessionUser } from "@/utils/getSessionUser";
import { AI_CREDIT_PACK } from "@/variables";

export default async function IndexPage() {
  const { userId } = await getSessionUser();
  if (!userId) redirect("/auth?from=/payment");

  // The amount is fixed on the server, and the metadata tells the webhook
  // which account to credit.
  const { client_secret: clientSecret, amount } =
    await stripe.paymentIntents.create({
      amount: AI_CREDIT_PACK.amount,
      currency: AI_CREDIT_PACK.currency,
      description: `${AI_CREDIT_PACK.credits} Reel-Reveal AI requests`,
      metadata: { userId, credits: String(AI_CREDIT_PACK.credits) },
      automatic_payment_methods: {
        enabled: true,
      },
    });

  return (
    <div id="checkout" className="page-wrapper flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2>{AI_CREDIT_PACK.credits} AI requests</h2>
        <p className="text-disabledColor">
          One-time payment. Used for the quiz and the AI chat after your free
          daily requests run out.
        </p>
      </div>
      <CheckoutForm clientSecret={clientSecret} amount={amount} />
    </div>
  );
}
