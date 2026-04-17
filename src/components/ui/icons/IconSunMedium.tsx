import type { SVGProps } from 'react';

export default function IconSunMedium(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Sun circle */}
      <circle cx="10" cy="10" r="3.5" />
      {/* 4 cardinal rays */}
      <line x1="10" y1="3" x2="10" y2="5" />
      <line x1="10" y1="15" x2="10" y2="17" />
      <line x1="3" y1="10" x2="5" y2="10" />
      <line x1="15" y1="10" x2="17" y2="10" />
    </svg>
  );
}
