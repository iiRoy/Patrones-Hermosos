'use client';
import React from 'react';

interface IconProps {
  width?: number | string;
  height?: number | string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
}

const ArrowCounterClockwise: React.FC<IconProps> = ({
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
      d='M21.375 12a9.375 9.375 0 0 1-9.25 9.375H12a9.318 9.318 0 0 1-6.433-2.558 1.125 1.125 0 0 1 1.545-1.636 7.125 7.125 0 1 0-.147-10.22l-.037.036-1.782 1.628H6.75a1.125 1.125 0 0 1 0 2.25h-4.5A1.125 1.125 0 0 1 1.125 9.75v-4.5a1.125 1.125 0 0 1 2.25 0v1.942L5.389 5.35A9.375 9.375 0 0 1 21.375 12Z'
    />{' '}
  </svg>
);

export default ArrowCounterClockwise;
