import type { SVGProps } from 'react';

export default function IconWaterHigh(props: SVGProps<SVGSVGElement>) {
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
      {/* Top droplet */}
      <path d="M10 3 C10 3 7.5 6.5 7.5 8.5 A2.5 2.5 0 0 0 12.5 8.5 C12.5 6.5 10 3 10 3 Z" />
      {/* Bottom-left droplet */}
      <path d="M6 10 C6 10 3.5 13 3.5 14.5 A2.5 2.5 0 0 0 8.5 14.5 C8.5 13 6 10 6 10 Z" />
      {/* Bottom-right droplet */}
      <path d="M14 10 C14 10 11.5 13 11.5 14.5 A2.5 2.5 0 0 0 16.5 14.5 C16.5 13 14 10 14 10 Z" />
    </svg>
  );
}
