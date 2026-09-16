import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/utils/stripe";
import { creditPayment } from "@/utils/creditPayment";

export async function POST(req: NextRequest) {
  
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { message: "Missing Stripe Signature" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
      const errorMessage = err.message;
      // On error, log and return the error message.
      if (err) console.log(err);
      console.log(`Error message: ${errorMessage}`);
      return NextResponse.json(
        { message: `Webhook Error: ${errorMessage}` },
        { status: 400 }
      );
  }
const permittedEvents = ["payment_intent.succeeded"];

 if (permittedEvents.includes(event.type)) {
   let data;

   try {
     switch (event.type) {
       case "payment_intent.succeeded":
         data = event.data.object;
         await creditPayment(data);
         break;
       default:
         throw new Error(`Unhandled event: ${event.type}`);
     }
   } catch (error) {
     console.log(error);
     return NextResponse.json(
       { message: "Webhook handler failed" },
       { status: 500 }
     );
   }
 }
 // Return a response to acknowledge receipt of the event.
 return NextResponse.json({ message: "Received" }, { status: 200 });
}
