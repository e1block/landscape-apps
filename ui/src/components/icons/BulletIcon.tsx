import React from 'react';
import { IconProps } from './icon';

export default function BulletIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="8" height="8" rx="4" className="fill-current" />
    </svg>
  );
}