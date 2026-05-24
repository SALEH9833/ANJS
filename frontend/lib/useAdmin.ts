'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdmin() {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('anjs_admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setReady(true);
    }
  }, [router]);

  return ready;
}
