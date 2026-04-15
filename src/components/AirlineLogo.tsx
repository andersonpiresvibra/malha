import React from 'react';
import { AIRLINE_LOGOS } from '../types';

interface Props {
  airline: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };

export const AirlineLogo: React.FC<Props> = ({ airline, size = 'md', className = '' }) => {
  const key  = (airline || '').toLowerCase().trim();
  const logo = AIRLINE_LOGOS[key];

  if (!logo) {
    return (
      <div className={`${SIZE_MAP[size]} flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs ${className}`}>
        {airline.substring(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={airline}
      className={`${SIZE_MAP[size]} object-contain rounded ${className}`}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
};
