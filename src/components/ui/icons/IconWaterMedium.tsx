import type { SVGProps } from 'react';

export default function IconWaterMedium(props: SVGProps<SVGSVGElement>) {
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
      {/* Left droplet */}
      <path d="M7 5 C7 5 4 9 4 11.5 A3 3 0 0 0 10 11.5 C10 9 7 5 7 5 Z" />
      {/* Right droplet */}
      <path d="M13 5 C13 5 10 9 10 11.5 A3 3 0 0 0 16 11.5 C16 9 13 5 13 5 Z" />
    </svg>
  );
}
