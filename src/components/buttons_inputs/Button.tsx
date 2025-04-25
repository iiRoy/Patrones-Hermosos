'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  disabled?: boolean;
  round?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  IconLeft?: React.FC<{ width?: number | string; height?: number | string; color?: string }>;
  IconRight?: React.FC<{ width?: number | string; height?: number | string; color?: string }>;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant,
  disabled = false,
  round = false,
  showLeftIcon = false,
  showRightIcon = false,
  IconLeft,
  IconRight,
  onClick,
  href,
  className = '',
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return;

    if (onClick) {
      onClick();
    }

    if (href) {
      router.push(href);
    }
  };

  const variantClass = `button-${variant}`;
  const disabledClass = disabled ? `${variant}-disabled dim` : '';
  const baseClass = round ? 'round-button' : 'custom-button';

  return (
    <button
      className={`${baseClass} ${variantClass} ${disabledClass} ${round ? 'aspect-square p-0 justify-center' : ''
        } flex items-center gap-2 ${className}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
    >
      {showLeftIcon && IconLeft && <IconLeft width={20} height={20} />}
      {!round && <span className="label">{label}</span>}
      {showRightIcon && IconRight && <IconRight width={20} height={20} />}
    </button>
  );
};

export default Button;
