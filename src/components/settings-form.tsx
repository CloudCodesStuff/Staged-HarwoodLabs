'use client';

import { Loader2 } from 'lucide-react';
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

export function SettingsForm() {
  const { data: session, status, update: updateSession } = useSession();
  const [name, setName] = useState('');

  const { mutate: updateProfile, isPending } =
    api.user.updateProfile.useMutation({
      onSuccess: async (updatedUser) => {
        toast.success('Profile updated successfully!');
        // Refresh the session to reflect the new name
        await updateSession({ user: { name: updatedUser.name } });
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to update profile.');
      },
    });

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSave = () => {
    if (name.trim() && name !== session?.user?.name) {
      updateProfile({ name: name.trim() });
    }
  };

  const isSaveDisabled =
    status === 'loading' ||
    isPending ||
    !name.trim() ||
    name === session?.user?.name;

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="name"
            >
              Name
            </label>
            <Input
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div>
            <label
              className="mb-1 block font-medium text-gray-700 text-sm"
              htmlFor="email"
            >
              Email
            </label>
            <Input disabled id="email" value={session?.user?.email ?? ''} />
          </div>
          <Button disabled={isSaveDisabled} onClick={handleSave}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="destructive"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
