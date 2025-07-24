'use client';

import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/trpc/react';

const UpgradeButton = () => {
  const { mutateAsync: createCheckoutSession, isPending } =
    api.stripe.createCheckoutSession.useMutation();
  const { push } = useRouter();
  return (
    <Button
      className="w-full"
      disabled={isPending}
      onClick={async () => {
        const { checkoutUrl } = await createCheckoutSession();
        if (checkoutUrl) {
          void push(checkoutUrl);
        }
      }}
    >
      Upgrade
    </Button>
  );
};

const ManageBillingButton = () => {
  const { mutateAsync: createBillingPortalSession, isPending } =
    api.stripe.createBillingPortalSession.useMutation();
  const { push } = useRouter();
  return (
    <Button
      className="w-full"
      disabled={isPending}
      onClick={async () => {
        const { billingPortalUrl } = await createBillingPortalSession();
        if (billingPortalUrl) {
          void push(billingPortalUrl);
        }
      }}
    >
      Manage Billing
    </Button>
  );
};

const pricingFeatures = {
  free: [
    { text: '2 projects', included: true },
    { text: 'Up to 3 file links per project', included: true },
    { text: 'Basic portal customization', included: true },
    { text: 'Unlimited projects', included: false },
    { text: 'Unlimited file links', included: false },
    { text: 'Full portal customization', included: false },
  ],
  studio: [
    { text: 'Unlimited projects', included: true },
    { text: 'Unlimited file links', included: true },
    { text: 'Full portal customization', included: true },
  ],
};

export default function PricingPage() {
  const { data: session } = useSession();
  const isSubscribed = session?.user?.stripeSubscriptionStatus === 'active';

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-bold text-4xl tracking-tight">Pricing</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Choose the plan that's right for you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className={isSubscribed ? '' : 'border-primary'}>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>
              For individuals and small teams getting started.
            </CardDescription>
            <p className="mt-4 font-bold text-4xl">$0/mo</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {pricingFeatures.free.map((feature) => (
                <li className="flex items-center gap-2" key={feature.text}>
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  <span
                    className={
                      feature.included
                        ? ''
                        : 'text-muted-foreground line-through'
                    }
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
            {isSubscribed ? (
              <Button className="w-full" disabled>
                Downgrade to Free
              </Button>
            ) : (
              <Button className="w-full" disabled>
                Your Current Plan
              </Button>
            )}
          </CardContent>
        </Card>
        <Card className={isSubscribed ? 'border-primary' : ''}>
          <CardHeader>
            <CardTitle>Studio</CardTitle>
            <CardDescription>
              For professionals and agencies who need more power.
            </CardDescription>
            <p className="mt-4 font-bold text-4xl">$19/mo</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {pricingFeatures.studio.map((feature) => (
                <li className="flex items-center gap-2" key={feature.text}>
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
            {isSubscribed ? <ManageBillingButton /> : <UpgradeButton />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
