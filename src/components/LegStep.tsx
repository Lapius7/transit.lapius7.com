import Link from "next/link";
import { ModeIcon, WalkIcon } from "./ModeIcon";
import { modeColor, modeLabel } from "@/lib/modes";
import { secsToClock } from "@/lib/time";
import type { JourneyLeg } from "@/lib/types";

interface LegStepProps {
  leg: JourneyLeg;
  isLast: boolean;
}

export function LegStep({ leg, isLast }: LegStepProps) {
  if (leg.kind === "walk") {
    const minutes = Math.max(1, Math.round((leg.arrivalSecs - leg.departureSecs) / 60));
    return (
      <li className="relative flex gap-3 pb-6">
        {!isLast && (
          <span className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-200" aria-hidden="true" />
        )}
        <span className="z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <WalkIcon className="h-3.5 w-3.5" />
        </span>
        <div className="flex-1 pt-0.5 text-sm">
          <p className="text-slate-600">
            徒歩 {minutes}分 ({leg.from.name} → {leg.to.name})
          </p>
        </div>
      </li>
    );
  }

  const color = modeColor(leg.mode, leg.color);

  return (
    <li className="relative flex gap-3 pb-6">
      {!isLast && (
        <span
          className="absolute left-[11px] top-6 bottom-0 w-px"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      )}
      <span
        className="z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: color }}
      >
        <ModeIcon mode={leg.mode} className="h-3.5 w-3.5" />
      </span>
      <div className="flex-1 space-y-1 text-sm">
        <p className="flex items-center gap-1.5 font-medium text-slate-900">
          <span>{secsToClock(leg.departureSecs)}</span>
          <Link href={`/station/${encodeURIComponent(leg.from.id)}`} className="hover:underline">
            {leg.from.name}
            {leg.from.platformCode && (
              <span className="text-xs text-slate-400"> {leg.from.platformCode}番線</span>
            )}
          </Link>
        </p>
        <p className="rounded-md px-2 py-1 text-xs text-white inline-flex items-center gap-1" style={{ backgroundColor: color }}>
          <ModeIcon mode={leg.mode} className="h-3 w-3" />
          {modeLabel(leg.mode)}・{leg.routeName}
          {leg.headsign && <span> {leg.headsign}行</span>}
        </p>
        <p className="flex items-center gap-1.5 font-medium text-slate-900">
          <span>{secsToClock(leg.arrivalSecs)}</span>
          <Link href={`/station/${encodeURIComponent(leg.to.id)}`} className="hover:underline">
            {leg.to.name}
            {leg.to.platformCode && (
              <span className="text-xs text-slate-400"> {leg.to.platformCode}番線</span>
            )}
          </Link>
        </p>
      </div>
    </li>
  );
}
