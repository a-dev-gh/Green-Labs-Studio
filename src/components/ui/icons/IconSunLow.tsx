import type { SVGProps } from 'react';

export default function IconSunLow(props: SVGProps<SVGSVGElement>) {
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
      {/* Horizon line */}
      <line x1="3" y1="13" x2="17" y2="13" />
      {/* Half-sun arc above horizon */}
      <path d="M6 13 A4 4 0 0 1 14 13" />
      {/* Single short ray upward */}
      <line x1="10" y1="9" x2="10" y2="7" />
    </svg>
  );
}
