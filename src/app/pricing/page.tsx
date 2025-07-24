'use client';

import { Check, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SocialProofSection } from '@/components/testimonial-05/testimonial-05';
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
  const { data: session, status } = useSession();
  const { mutateAsync: createCheckoutSession, isPending } =
    api.stripe.createCheckoutSession.useMutation();
  const { push } = useRouter();

  const handleUpgrade = async () => {
    if (status === 'unauthenticated') {
      push('/signup');
      return;
    }

    if (status === 'authenticated') {
      const { checkoutUrl } = await createCheckoutSession();
      if (checkoutUrl) {
        void push(checkoutUrl);
      }
    }
  };

  if (status === 'loading') {
    return (
      <Button className="w-full" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <Button className="w-full" disabled={isPending} onClick={handleUpgrade}>
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {status === 'unauthenticated' ? 'Sign up to Upgrade' : 'Upgrade'}
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
  const { data: session, status } = useSession();
  const isSubscribed =
    status === 'authenticated' &&
    session?.user?.stripeSubscriptionStatus === 'active';

  const getFreePlanButton = () => {
    if (status === 'unauthenticated' || status === 'loading') {
      return (
        <Button asChild className="w-full" variant="outline">
          <a href="/signup">Get Started</a>
        </Button>
      );
    }
    if (isSubscribed) {
      return (
        <Button className="w-full" disabled>
          Downgrade to Free
        </Button>
      );
    }
    return (
      <Button className="w-full" disabled>
        Your Current Plan
      </Button>
    );
  };

  const getStudioPlanButton = () => {
    if (status === 'loading') {
      return (
        <Button className="w-full" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      );
    }
    if (isSubscribed) {
      return <ManageBillingButton />;
    }
    return <UpgradeButton />;
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <SocialProofSection />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-bold text-4xl tracking-tight">Pricing</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Transparent, predictable pricing. No hidden fees, no surprises. Start
          for free—upgrade only when you need more.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card
          className={
            !isSubscribed && status === 'authenticated' ? 'border-primary' : ''
          }
        >
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
            {getFreePlanButton()}
          </CardContent>
        </Card>
        <Card className={isSubscribed ? 'border-primary' : ''}>
          <CardHeader>
            <CardTitle>Studio</CardTitle>
            <CardDescription>
              For professionals and agencies who need more power.
            </CardDescription>
            <p className="mt-4 font-bold text-4xl">$9/mo</p>
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
            {getStudioPlanButton()}
          </CardContent>
        </Card>
      </div>
      <SocialProofSection />
    </div>
  );
}
