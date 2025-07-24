import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard-header';
import Onboarding from '@/components/onboarding';
import { auth } from '@/server/auth';
import { db } from '@/server/db'; // Adjust this to your actual db import
import { Onborda, OnbordaProvider } from "onborda";
import { steps } from '@/onboarding/steps';
import { TourCard } from '@/components/tour';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // const user = await db.user.findUnique({
  //   where: { id: session.user.id },
  //   select: { onboarded: true },
  // });

  // if (!user?.onboarded) {
  //   return <Onboarding />;
  // }

  return (
    <OnbordaProvider>
      <Onborda steps={steps}   showOnborda={true}
    shadowRgb="0,0,0"
    shadowOpacity="0.5"
    cardComponent={TourCard}
    cardTransition={{ duration: 2, type: "tween" }}>
        <div className="flex min-h-screen flex-col">
          <DashboardHeader />
          <main>{children}</main>
        </div>
      </Onborda>
    </OnbordaProvider>
  );
}
