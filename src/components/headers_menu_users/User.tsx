'use client';
import Image from 'next/image';
import Link from 'next/link';
import withIconDecorator from '../decorators/IconDecorator';
import * as Icons from '../icons';
export const Notification = withIconDecorator(Icons.Megaphone);
export const Info = withIconDecorator(Icons.Info);
export const Arrow = withIconDecorator(Icons.ArrowArcLeft);

const User = () => {
  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='px-1 flex items-center lg:ml-2 justify-center inline-block lg:justify-start pb-0'>
        <Link href={'/'} className='flex items-center justify-center gap-3 p-2'>
          <Image
            src={'/assets/avatar.png'}
            alt='user'
            width={35}
            height={35}
            className='md:min-w-[3.5vw] md:min-h-[3.5vw] min-w-[5vmax] min-h-[5vmax] rounded-full'
          />
          <div className='flex flex-col text-left hidden lg:block'>
            <span className='text-sm leading-5 text-[1.51vmax]'>User</span>
            <span className='text-[1vmax] font-medium text-textDim block break-all'>
              @username_example
            </span>
          </div>
        </Link>
      </div>
      <div className='flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-end pb-2 pr-1'>
        <Link
          href={'/'}
          className='option-link w-auto h-auto flex items-center justify-center p-2 cursor-pointer relative'
        >
          <Notification width={'1.5rem'} height={'1.5rem'} strokeColor='#2E1C31' strokeWidth={1} />
          <div className='absolute transform -translate-y-1/2 w-[0.9vw] h-[0.9vw] md:min-w-[1.5vw] md:min-h-[1.5vw] min-w-[2.2vmax] min-h-[2.2vmax] top-2 lg:top-1.5 lg:right-0 right-1 p-1 pr-1.5 pl-1.5 flex items-center justify-center bg-purple-500 text-white rounded-full text-[clamp(0.5rem,1.0vw,2rem)]'>
            1
          </div>
        </Link>
        <Link href={'/'} className='option-link flex items-center justify-center p-2'>
          <Info width={'1.5rem'} height={'1.5rem'} strokeColor='#2E1C31' strokeWidth={1} />
        </Link>
        <Link href={'/'} className='option-link flex items-center justify-center p-2'>
          <Arrow width={'1.5rem'} height={'1.5rem'} strokeColor='#2E1C31' strokeWidth={1} />
        </Link>
      </div>
    </div>
  );
};

export default User;
