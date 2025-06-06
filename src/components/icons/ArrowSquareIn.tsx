'use client';
import React from 'react';

interface IconProps {
  width?: number | string;
  height?: number | string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
}

const ArrowSquareIn: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  strokeColor = 'currentColor',
  fillColor = 'none',
  strokeWidth = 1,
}) => (
  <svg
    width={width}
    height={height}
    stroke={strokeColor}
    fill={fillColor}
    strokeWidth={strokeWidth}
    vectorEffect='non-scaling-stroke'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
  >
    {' '}
    <path
      stroke={strokeColor}
      fill={fillColor}
      strokeWidth={strokeWidth}
      vectorEffect='non-scaling-stroke'
      d='M12.375 12.75v6a1.125 1.125 0 1 1-2.25 0v-3.281l-5.58 5.577a1.126 1.126 0 0 1-1.837-1.228c.057-.137.14-.261.244-.366l5.58-5.577H5.25a1.125 1.125 0 1 1 0-2.25h6a1.125 1.125 0 0 1 1.125 1.125ZM19.5 2.625h-12A1.875 1.875 0 0 0 5.625 4.5v4.125a1.125 1.125 0 0 0 2.25 0v-3.75h11.25v11.25h-3.75a1.125 1.125 0 1 0 0 2.25H19.5a1.875 1.875 0 0 0 1.875-1.875v-12A1.875 1.875 0 0 0 19.5 2.625Z'
    />{' '}
  </svg>
);

export default ArrowSquareIn;
