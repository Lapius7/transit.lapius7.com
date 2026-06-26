import { ModeIcon } from "./ModeIcon";
import { modeColor, modeLabel } from "@/lib/modes";
import { secsToDayOffsetClock } from "@/lib/time";
import type { Departure } from "@/lib/types";

interface DepartureBoardProps {
  departures: Departure[];
}

export function DepartureBoard({ departures }: DepartureBoardProps) {
  if (departures.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        この時間帯の発車情報はありません。
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {departures.map((dep, idx) => {
        const color = modeColor(dep.mode, dep.color);
        return (
          <li key={idx} className="flex items-center gap-3 px-4 py-3">
            <span className="w-14 shrink-0 text-base font-semibold text-slate-900">
              {secsToDayOffsetClock(dep.departureSecs)}
            </span>
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              <ModeIcon mode={dep.mode} className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 text-sm text-slate-700">
              <span className="font-medium text-slate-900">{dep.routeName}</span>
              {dep.headsign && <span> {dep.headsign}行</span>}
              <span className="ml-1.5 text-xs text-slate-400">{modeLabel(dep.mode)}</span>
            </span>
            {dep.headwayBased && (
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                等間隔運行
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
