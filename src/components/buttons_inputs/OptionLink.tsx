'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import withIconDecorator from '../decorators/IconDecorator';

interface OptionLinkProps {
  label: string;
  Icon: React.FC<{
    width?: number | string;
    height?: number | string;
    strokeColor?: string;
    fillColor?: string;
    className?: string;
  }>;
  href: string;
}

const OptionLink: React.FC<OptionLinkProps> = ({ label, Icon, href }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const DecoratedIcon = withIconDecorator(Icon);

  return (
    <Link
      href={href}
      className={`
        option-link ${isActive ? 'active' : ''}
        flex justify-center items-center gap-2 items-center
      `}
    >
      <div className={`option-icon ${isActive ? 'active' : ''} flex items-center justify-center`}>
        <DecoratedIcon
          strokeColor={'#2E1C31'}
          fillColor={'currentColor'}
          width={'2rem'}
          height={'2rem'}
        />
      </div>
      <span className='option-label hidden lg:block'>{label}</span>
    </Link>
  );
};

export default OptionLink;
