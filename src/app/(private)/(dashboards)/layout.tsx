'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Menu from '@/components/headers_menu_users/Menu';
import User from '@/components/headers_menu_users/User';
import NotificationMenu from '@/components/headers_menu_users/NotificationMenu';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1024px)');
    function handleMedia(e: MediaQueryListEvent | MediaQueryList) {
      if (e.matches) {
        setShowNotifications(false);
      }
    }
    handleMedia(media);
    media.addEventListener('change', handleMedia);
    return () => media.removeEventListener('change', handleMedia);
  }, []);

  return (
    <div className='h-screen flex text-text bg-back'>
      {/* LEFT: Sidebar */}
      <div className='pt-[1.9vw] gap-[3vw] w-[9%] md:w-[8%] lg:w-[18%] xl:w-[18%] overflow-x-hidden min-w-[10vw] max-h-screen flex flex-col items-center justify-between bg-[#2E1C31] rounded-tr-[1.5vmax] rounded-br-[1.5vmax] scrollbar-hide'>
        <div className='p-1 lg:p-0 justify-center'>
          <Link href='/'>
            <Image
              src='/assets/logo.png'
              alt='logo'
              width={110}
              height={110}
              className='lg:max-w-[8vw] md:max-w-[5vw] sm:max-w-[7vw]'
            />
          </Link>
        </div>
        {/* Menú principal o notificaciones, con animación fade */}
        <div className="relative w-full flex-1 flex flex-col items-center justify-center">
          {/* Menu */}
          <div
            className={`
              transition-opacity
              ${showNotifications ? 'duration-300 opacity-0 pointer-events-none' : 'duration-1000 opacity-100 pointer-events-auto'}
            `}
          >
            <Menu />
          </div>
          {/* NotificationMenu */}
          <div
            className={`
              absolute h-full transition-opacity
              ${showNotifications ? 'duration-1000 opacity-100 pointer-events-auto' : 'duration-300 opacity-0 pointer-events-none'}
            `}
          >
            <NotificationMenu open={showNotifications} onClose={() => setShowNotifications(false)} />
          </div>
        </div>
        {/* User controla el toggle */}
        <User
          showNotifications={showNotifications}
          onToggleNotifications={() => setShowNotifications(v => !v)}
        />
      </div>
      {/* RIGHT: Main content */}
      <div className='w-[91%] md:w-[92%] lg:w-[83%] xl:w-[85%] relative overflow-x-hidden custom-scrollbar'>
        {/* ...Círculos decorativos y demás */}
        <div className='relative overflow-x-hidden z-0'>{children}</div>
      </div>
    </div>
  );
}
