import type { SVGProps } from 'react';

export default function IconWaterLow(props: SVGProps<SVGSVGElement>) {
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
      {/* Single droplet centered */}
      <path d="M10 4 C10 4 6 9 6 12 A4 4 0 0 0 14 12 C14 9 10 4 10 4 Z" />
    </svg>
  );
}
