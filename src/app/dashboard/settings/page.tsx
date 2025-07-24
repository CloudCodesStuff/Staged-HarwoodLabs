import type { Metadata } from 'next';
import { BillingForm } from '@/components/billing';
import { SettingsForm } from '@/components/settings-form';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <h1 className="font-bold text-3xl">Settings</h1>
      <BillingForm />
      <SettingsForm />
    </div>
  );
}
