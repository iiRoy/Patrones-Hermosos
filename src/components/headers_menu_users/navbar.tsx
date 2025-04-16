'use client';
import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  {
    title: 'NAVIGATION',
    items: [
      {
        icon: '/home.png',
        label: 'Postúlate',
        href: '/',
        type: 'link',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/teacher.png',
        label: 'Conócenos',
        href: '/list/teachers',
        type: 'link',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/student.png',
        label: 'Iniciar Sesión',
        href: '/list/students',
        type: 'button',
        visible: ['admin', 'teacher'],
      },
    ],
  },
];

const Navbar = () => {
  return (
    <div className='flex item-center justify-between pr-4 pl-4 pb-2 pt-2 bg-[#2E1C31] shadow-md w-full rounded-b-lg'>
      {/*LOGO*/}
      <div className='hidden md:block flex items-center justify-center'>
        <Image src='/logo.png' alt='logo' width={60} height={60} className='center' />
      </div>
      {/*NAVIGATION*/}
      <div className=''>
        {navItems.map((i) => (
          <div key={i.title} className='flex gap-2 items-center justify-center h-full'>
            {i.items.map((item) =>
              item.type === 'link' ? (
                <Link
                  href={item.href}
                  key={item.label}
                  className='flex items-center justify-center gap-2 p-2 rounded-md transition duration-200 ease-in-out group'
                >
                  <div className='center'>
                    <Image
                      src={item.icon}
                      alt=''
                      width={25}
                      height={25}
                      className='group-hover:fill-[#B673BD] transition duration-200 ease-in-out'
                    />
                  </div>
                  <span className='hidden lg:block text-white'>{item.label}</span>
                </Link>
              ) : (
                <button
                  key={item.label}
                  className='flex items-center justify-center gap-2 p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-200 ease-in-out'
                >
                  <Image src={item.icon} alt='' width={30} height={30} className='center' />
                  <span className='hidden lg:block text-white-500'>{item.label}</span>
                </button>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
