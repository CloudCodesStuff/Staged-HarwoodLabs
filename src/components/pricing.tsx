'use client';

import { CircleCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
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
    <Button
      className="mt-6 w-full"
      disabled={isPending}
      onClick={handleUpgrade}
      size="lg"
      variant="outline"
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {status === 'unauthenticated'
        ? 'Sign up to Upgrade'
        : 'Upgrade to Studio'}
    </Button>
  );
};

const ManageBillingButton = () => {
  const { mutateAsync: createBillingPortalSession, isPending } =
    api.stripe.createBillingPortalSession.useMutation();
  const { push } = useRouter();
  return (
    <Button
      className="mt-6 w-full"
      disabled={isPending}
      onClick={async () => {
        const { billingPortalUrl } = await createBillingPortalSession();
        if (billingPortalUrl) {
          void push(billingPortalUrl);
        }
      }}
      size="lg"
      variant="secondary"
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Manage Billing
    </Button>
  );
};

const plans = [
  {
    name: 'Starter',
    price: 0,
    description:
      'Perfect for freelancers or solo operators testing Staged with a few clients.',
    features: [
      'Up to 2 active client portals',
      'Up to 3 file links per project',
      'Milestone tracking & updates',
      'Chat with clients',
      'Basic theming',
    ],
    isPopular: false,
  },
  {
    name: 'Studio',
    price: '19/mo',
    isPopular: true,
    description:
      'Ideal for small agencies that manage multiple clients with branded experiences.',
    features: [
      'Unlimited active portals',
      'Unlimited file links',
      'Advanced theming and presets',
      'Priority support',
    ],
  },
];

const PricingStaged = () => {
  const { data: session, status } = useSession();
  const isSubscribed =
    status === 'authenticated' &&
    session?.user?.stripeSubscriptionStatus === 'active';

  const renderButton = (plan: (typeof plans)[0]) => {
    if (status === 'loading') {
      return (
        <Button className="mt-6 w-full" disabled size="lg">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      );
    }

    if (plan.name === 'Starter') {
      if (status === 'unauthenticated') {
        return (
          <Button asChild className="mt-6 w-full" size="lg" variant="outline">
            <a href="/signup">Start for Free</a>
          </Button>
        );
      }
      return (
        <Button className="mt-6 w-full" disabled size="lg" variant="outline">
          Your Current Plan
        </Button>
      );
    }

    if (plan.name === 'Studio') {
      if (isSubscribed) {
        return <ManageBillingButton />;
      }
      return <UpgradeButton />;
    }
  };

  return (
    <div
      className="n flex flex-col items-center justify-center px-6 py-44"
      id="pricing"
    >
      <h1 className="mb-6 font-head font-medium text-6xl">Pricing</h1>
      <p className="max-w-xl text-center text-muted-foreground">
        Choose a plan that fits your workflow. All plans come with full access
        to client portals, milestone updates, and messaging.
      </p>

      <div className="mx-auto mt-12 grid w-full max-w-screen-lg grid-cols-1 gap-8 lg:grid-cols-2">
        {plans.map((plan) => (
          <div
            className={cn(
              'relative rounded-xl border p-6 transition-shadow hover:shadow-md',
              {
                'border-[2px] border-secondary py-10': plan.isPopular,
              }
            )}
            key={plan.name}
          >
            {plan.isPopular && (
              <Badge
                className="-translate-x-2 absolute top-0 right-0 translate-y-2 px-3 py-1 text-sm"
                variant={'secondary'}
              >
                Most Popular
              </Badge>
            )}
            <h3 className="font-semibold text-xl">{plan.name}</h3>
            <p className="mt-2 font-bold text-4xl">
              {plan.price === 0 ? 'Free' : `$${plan.price}`}
            </p>
            <p className="mt-4 font-medium text-muted-foreground">
              {plan.description}
            </p>
            <Separator className="my-4" />
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li className="flex items-start gap-2" key={feature}>
                  <CircleCheck className="mt-1 h-4 w-4 text-green-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {renderButton(plan)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingStaged;
