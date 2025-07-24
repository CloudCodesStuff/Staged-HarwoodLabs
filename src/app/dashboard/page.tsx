'use client';

import { Loader2, Mail, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CreateProjectModal } from '@/components/create-project-modal';
import { Nav } from '@/components/nav';
import { RecentActivity } from '@/components/recent-activity';
import { RecentProjects } from '@/components/recent-projects';
import { StatsGrid } from '@/components/stats-grid';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/trpc/react';

const DebugEmailButton = () => {
  const { mutate: sendEmail, isPending } =
    api.user.sendWelcomeEmail.useMutation({
      onSuccess: () => {
        toast.success('Test email sent successfully!');
      },
      onError: (error) => {
        toast.error(`Failed to send email: ${error.message}`);
      },
    });

  return (
    <Button
      disabled={isPending}
      onClick={() => sendEmail()}
      size="sm"
      variant="outline"
    >
      <Mail className="mr-2 h-4 w-4" />
      Send Test Email
    </Button>
  );
};

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

const DashboardCheckoutModal = () => {
  const searchParams = useSearchParams();
  const canceled = searchParams?.get('checkoutCanceled') === 'true';
  const success = searchParams?.get('checkoutSuccess') === 'true';
  const show = canceled || success;
  const [open, setOpen] = useState(show);
  useEffect(() => {
    setOpen(show);
  }, [show]);
  if (!show) return null;
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {canceled
              ? 'Something went wrong with your checkout'
              : 'Upgrade successful!'}
          </DialogTitle>
          <DialogDescription>
            {canceled
              ? 'Your payment was not completed. Please try again.'
              : 'Your account has been upgraded. Enjoy Studio features!'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {canceled ? <UpgradeButton /> : <ManageBillingButton />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <DashboardCheckoutModal />
        <div className="space-y-8">
          {/* Dashboard Header */}
          <div className="relative overflow-hidden rounded-2xl border p-6 ">
            {/* Mesh gradient background */}
            <div className="-z-10 absolute inset-0">
              <div className="-z-10 absolute bottom-0 h-full w-full bg-white">
                <div className="-translate-y-[30%] absolute top-auto right-0 bottom-0 left-auto h-[500px] w-[500px] translate-x-[30%] rounded-full bg-secondary blur-[80px]" />
              </div>
            </div>

            {/* Header content */}
            <div id='create-project' className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1.5">
                {user?.name ? (
                  <h1 className="fade-in animate-in font-bold text-3xl tracking-tight">
                    Welcome back, {user.name.split(' ')[0]}!
                  </h1>
                ) : (
                  <h1 className="fade-in animate-in font-semibold text-2xl tracking-tight">
                    Welcome{' '}
                    <span className="text-muted-foreground">friend</span> !
                  </h1>
                )}
                <p className="text-muted-foreground text-sm">
                  Here's what's new since your last visit.
                </p>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2" >
                <CreateProjectModal />
              </div>
            </div>

            <div className=" mt-3 pt-3" />
            <StatsGrid />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Recent Projects */}
            <RecentProjects />

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
