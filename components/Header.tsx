'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Globe, Bell, User } from 'lucide-react';
import UserNav from './UserNav';

export default function Header({ user }: { user: any }) {
  const pathname = usePathname();

  // Hide header on login page
  if (pathname === '/login') return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f8faf9]/80 backdrop-blur-xl px-6 lg:px-16 py-6 lg:py-8">
      <div className="flex items-center justify-end">
        <UserNav user={user} />
      </div>
    </header>
  );
}
