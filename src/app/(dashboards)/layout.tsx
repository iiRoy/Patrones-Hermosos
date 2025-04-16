'use client';
import Link from 'next/link';
import Image from 'next/image';
import Menu from '@/components/headers_menu_users/Menu';
import User from '@/components/headers_menu_users/User';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-screen flex text-text bg-back'>
      {/* LEFT */}
      <div className='pt-[1.9vw] gap-[3vw] w-[9%] md:w-[8%] lg:w-[18%] xl:w-[18%] overflow-x-hidden min-w-[10vw] max-h-screen flex flex-col items-center justify-between bg-[#2E1C31] rounded-tr-[1.5vmax] rounded-br-[1.5vmax] scrollbar-hide'>
        <div className='p-1 lg:p-0 justify-center'>
          <Link href='/'>
            <Image
              src='/assets/logo.png'
              alt='logo'
              width={110}
              height={110}
              className='lg: max-w-[8vw] md: max-w-[5vw] sm: max-w-[7vw]'
            />
          </Link>
        </div>
        <Menu />
        <User />
      </div>
      {/* RIGHT */}
      <div className='w-[91%] md:w-[92%] lg:w-[83%] xl:w-[85%] relative overflow-x-hidden custom-scrollbar'>
        <div className=' sticky z-20 overflow-x-clip'>
          {/* Círculos en la esquina superior derecha */}
          <div className='absolute top-0 right-[6vw] w-[8vw] h-[8vw] bg-[#C57FAB] rounded-full transform -translate-y-2/3 shadow-custom-dark'></div>
          <div className='absolute top-[4vw] right-[-1vw] w-[10vw] h-[10vw] bg-[#97639C] rounded-full transform translate-x-1/3 -translate-y-1/4 shadow-custom-dark'></div>
          <div className='absolute top-0 right-[1vw] w-[9vw] h-[9vw] bg-[#2E1C31] rounded-full transform translate-x-1/4 -translate-y-2/4 shadow-custom-dark'></div>
          <div className='absolute top-[4vw] right-[7vw] w-[4vw] h-[4vw] bg-[#EBE6EB] rounded-full shadow-custom-dark'></div>
          <div className='absolute top-[3vw] right-[12vw] w-[2.5vw] h-[2.5vw] bg-[#EBE6EB] rounded-full shadow-custom-dark'></div>
        </div>
        <div className='relative overflow-x-hidden z-0'>{children}</div>
      </div>
    </div>
  );
}
