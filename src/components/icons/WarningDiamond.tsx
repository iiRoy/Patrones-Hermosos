'use client';
import React from 'react';

interface IconProps {
  width?: number | string;
  height?: number | string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
}

const WarningDiamond: React.FC<IconProps> = ({
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
      d='M12 6.375A1.125 1.125 0 0 1 13.125 7.5v4.875a1.125 1.125 0 1 1-2.25 0V7.5A1.125 1.125 0 0 1 12 6.375Zm0 8.25a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM22.875 12a1.864 1.864 0 0 1-.547 1.323l-9 9.005a1.875 1.875 0 0 1-2.645 0l-9-9.005a1.875 1.875 0 0 1 0-2.646l9.005-9.005a1.875 1.875 0 0 1 2.644 0l9.006 9.005A1.86 1.86 0 0 1 22.875 12Zm-2.407 0L12 3.532 3.533 12 12 20.468 20.468 12Z'
    />{' '}
  </svg>
);

export default WarningDiamond;
