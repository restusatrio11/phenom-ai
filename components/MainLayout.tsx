'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLoading } from '@/context/LoadingContext';

export default function MainLayout({ 
  children, 
  user 
}: { 
  children: React.ReactNode; 
  user: any 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="relative flex min-h-screen overflow-x-hidden">
      <Sidebar 
        user={user} 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />
      <div className={`flex-1 flex flex-col transition-all duration-500 ${
        (user && !isLoginPage) ? (isCollapsed ? 'lg:pl-24' : 'lg:pl-72') : ''
      }`}>
        <Header user={user} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
