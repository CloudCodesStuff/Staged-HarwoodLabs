// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import type { Stripe } from 'stripe';
import { env } from '@/env';
import { db } from '@/server/db';
import { stripe } from '@/server/stripe/client';
import {
  handleInvoicePaid,
  handleSubscriptionCanceled,
  handleSubscriptionCreatedOrUpdated,
} from '@/server/stripe/webhook';

// Disabling Next.js' default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);
  const sig = req.headers.get('stripe-signature');

  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig || '', webhookSecret);

    // Handle the event
    switch (event.type) {
      case 'invoice.paid':
        await handleInvoicePaid({ event, stripe, db });
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionCreatedOrUpdated({ event, db });
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled({ event, db });
        break;
      case 'invoice.payment_failed':
        // Add logic if needed
        break;
      default:
        // Unknown event type
        break;
    }

    // Save event to DB
    await db.stripeEvent.create({
      data: {
        id: event.id,
        type: event.type,
        object: event.object,
        api_version: event.api_version,
        account: event.account,
        created: new Date(event.created * 1000),
        data: JSON.parse(
          JSON.stringify({
            object: event.data.object,
            previous_attributes: event.data.previous_attributes,
          })
        ),
        livemode: event.livemode,
        pending_webhooks: event.pending_webhooks,
        request: {
          id: event.request?.id,
          idempotency_key: event.request?.idempotency_key,
        },
      },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    return new NextResponse('Webhook Error: ' + (err as Error).message, {
      status: 400,
    });
  }
}
