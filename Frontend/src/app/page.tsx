'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { paths } from '@/paths';

export default function Page() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Redirect to /ui/home as default path when the app starts
      router.replace(paths.ui.home);
    }
  }, [isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Display loading state
  }

  return null;
}
