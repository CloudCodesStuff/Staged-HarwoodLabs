import { getOrCreateStripeCustomerIdForUser } from "@/server/stripe/webhook";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "@/env";


export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, session, db, headers } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      db,
      stripe,
      userId: session.user?.id,
    });

    if (!customerId) {
      throw new Error("Could not create customer");
    }

    const baseUrl =
      env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : env.NEXT_AUTH;

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: session.user?.id,
      payment_method_types: ["card"],
      allow_promotion_codes:true,
      mode: "subscription",
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?checkoutSuccess=true`,
      cancel_url: `${baseUrl}/dashboard?checkoutCanceled=true`,
      subscription_data: {
        metadata: {
          userId: session.user?.id,
        },
      },
    });

    if (!checkoutSession) {
      throw new Error("Could not create checkout session");
    }

    return { checkoutUrl: checkoutSession.url };
  }),
  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, session, db, headers } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      db,
      stripe,
      userId: session.user?.id,
    });

    if (!customerId) {
      throw new Error("Could not create customer");
    }

    const baseUrl =
      env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : env.NEXT_AUTH;

    const stripeBillingPortalSession =
      await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/dashboard`,
      });

    if (!stripeBillingPortalSession) {
      throw new Error("Could not create billing portal session");
    }

    return { billingPortalUrl: stripeBillingPortalSession.url };
  }),
});