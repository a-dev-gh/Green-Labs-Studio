import type { SVGProps } from 'react';

export default function IconSunHigh(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Sun circle */}
      <circle cx="10" cy="10" r="3" />
      {/* 8 rays: cardinal + ordinal */}
      <line x1="10" y1="2.5" x2="10" y2="4.5" />
      <line x1="10" y1="15.5" x2="10" y2="17.5" />
      <line x1="2.5" y1="10" x2="4.5" y2="10" />
      <line x1="15.5" y1="10" x2="17.5" y2="10" />
      <line x1="4.57" y1="4.57" x2="5.99" y2="5.99" />
      <line x1="14.01" y1="14.01" x2="15.43" y2="15.43" />
      <line x1="15.43" y1="4.57" x2="14.01" y2="5.99" />
      <line x1="5.99" y1="14.01" x2="4.57" y2="15.43" />
    </svg>
  );
}
