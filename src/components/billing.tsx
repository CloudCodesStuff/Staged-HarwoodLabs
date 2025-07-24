'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';

const UpgradeButton = () => {
  const { mutateAsync: createCheckoutSession, isPending } =
    api.stripe.createCheckoutSession.useMutation();
  const { push } = useRouter();
  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        const { checkoutUrl } = await createCheckoutSession();
        if (checkoutUrl) {
          void push(checkoutUrl);
        }
      }}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Upgrade account
    </Button>
  );
};

const ManageBillingButton = () => {
  const { mutateAsync: createBillingPortalSession, isPending } =
    api.stripe.createBillingPortalSession.useMutation();
  const { push } = useRouter();
  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        const { billingPortalUrl } = await createBillingPortalSession();
        if (billingPortalUrl) {
          void push(billingPortalUrl);
        }
      }}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Manage subscription and billing
    </Button>
  );
};
export function BillingForm() {
  const { data: session, status, update: updateSession } = useSession();
  const [name, setName] = useState('');

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  const { mutate: updateUser, isPending } = api.user.updateProfile.useMutation({
    onSuccess: async () => {
      toast.success('Profile updated successfully!');
      await updateSession();
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  const handleSave = () => {
    if (name && name !== session?.user?.name) {
      updateUser({ name });
    }
  };

  const isSaveDisabled = name === (session?.user?.name ?? '') || isPending;

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        {/* Skeleton Loader */}
        <Card>
          <CardHeader>
            <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-1/4 animate-pulse rounded bg-gray-200" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          </CardHeader>
          <CardContent>
            <div className="h-10 w-1/3 animate-pulse rounded bg-gray-200" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          </CardHeader>
          <CardContent>
            <div className="h-10 w-1/4 animate-pulse rounded bg-gray-200" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSubscribed = session?.user?.stripeSubscriptionStatus === 'active';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            {isSubscribed
              ? 'You are on the Studio plan.'
              : 'You are on the free plan. Upgrade for more features.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubscribed ? <ManageBillingButton /> : <UpgradeButton />}
        </CardContent>
      </Card>
    </div>
  );
}
