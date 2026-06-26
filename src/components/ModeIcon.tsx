import type { TransitMode } from "@/lib/types";

interface ModeIconProps {
  mode: TransitMode | string;
  className?: string;
}

/** モードごとの最低限の記号アイコン。外部アイコンライブラリは導入しない。 */
export function ModeIcon({ mode, className = "h-4 w-4" }: ModeIconProps) {
  switch (mode) {
    case "rail":
    case "subway":
    case "monorail":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="4" y="3" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 11h16" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8" cy="14.5" r="1" fill="currentColor" />
          <circle cx="16" cy="14.5" r="1" fill="currentColor" />
          <path d="M7 21l1.5-3M17 21l-1.5-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "bus":
    case "trolleybus":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3" y="5" width="18" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 11h18" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="7.5" cy="18.5" r="1.4" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="16.5" cy="18.5" r="1.4" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "tram":
    case "cableTram":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="4" y="6" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 11h16M2 6h20" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8" cy="18.5" r="1.2" fill="currentColor" />
          <circle cx="16" cy="18.5" r="1.2" fill="currentColor" />
        </svg>
      );
    case "ferry":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M5 14l-1.5 4.5c2 1 4 1.5 6.5 1.5s4.5-.5 6.5-1.5S21 17 21 17"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M6 14V8h8l3 6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M10 8V4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "aerialLift":
    case "funicular":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M3 6l18 4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 7.2v3.5M16 9.5V13" stroke="currentColor" strokeWidth="1.6" />
          <rect x="6" y="10.5" width="4" height="3.5" rx="0.8" stroke="currentColor" strokeWidth="1.4" />
          <rect x="14" y="13" width="4" height="3.5" rx="0.8" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "air":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M10.5 3l1 6.5L20 13l-.4 1.4-8-1.6-1 4.7 2 1.4-.3 1.1-3.3-1-3.3 1-.3-1.1 2-1.4-1-4.7-8 1.6L4.5 13l8.5-3.5 1-6.5h.5z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}

export function WalkIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="13.5" cy="4" r="1.6" fill="currentColor" />
      <path
        d="M11 8l2.5-1.2L16 9l2 1.5M9 22l1.8-6 2-2-1-4.5L8 11l-1.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.5 13l3 1.5 1 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
