'use client';
import React from 'react';

interface CustomLegendProps {
  legendKeys: string[];
}

const CustomLegend: React.FC<CustomLegendProps> = ({ legendKeys }) => (
  <div className='flex items-center gap-4'>
    {legendKeys.map((key, index) => (
      <div key={key} className='flex items-center gap-1'>
        <span
          className={`w-3 h-3 rounded-full ${index % 2 === 0 ? 'bg-primary' : 'bg-secondaryShade'}`}
        />
        <span className={`font-medium ${index % 2 === 0 ? 'text-primary' : 'text-secondaryShade'}`}>
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </span>
      </div>
    ))}
  </div>
);

export default CustomLegend;
