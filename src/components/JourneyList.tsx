"use client";

import { useState } from "react";
import { JourneyDetail } from "./JourneyDetail";
import { ModeIcon } from "./ModeIcon";
import { modeColor } from "@/lib/modes";
import { secsToClock, secsToDuration } from "@/lib/time";
import type { Journey } from "@/lib/types";

interface JourneyListProps {
  journeys: Journey[];
}

export function JourneyList({ journeys }: JourneyListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (journeys.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        条件に合う経路が見つかりませんでした。検索条件を変えてお試しください。
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {journeys.map((journey, idx) => {
        const isOpen = openIndex === idx;
        const transitLegs = journey.legs.filter((l) => l.kind === "transit");

        return (
          <li
            key={idx}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="flex w-full flex-col gap-2 px-4 py-3.5 text-left sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-slate-900">
                  {secsToClock(journey.departureSecs)}
                </span>
                <span className="text-slate-400">→</span>
                <span className="text-lg font-semibold text-slate-900">
                  {secsToClock(journey.arrivalSecs)}
                </span>
                <span className="text-sm text-slate-500">
                  ({secsToDuration(journey.durationSecs)})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  {transitLegs.map((leg, i) => (
                    <span
                      key={i}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-white"
                      style={{
                        backgroundColor:
                          leg.kind === "transit" ? modeColor(leg.mode, leg.color) : undefined,
                      }}
                    >
                      {leg.kind === "transit" && <ModeIcon mode={leg.mode} className="h-3 w-3" />}
                    </span>
                  ))}
                </span>
                <span>乗換{journey.transferCount}回</span>
                {journey.fare && (
                  <span className="font-medium text-slate-900">
                    {journey.fare.ic !== undefined
                      ? `IC ${journey.fare.ic}円`
                      : `${journey.fare.ticket}円`}
                  </span>
                )}
                <span className="text-teal-700">{isOpen ? "閉じる ▲" : "詳細 ▼"}</span>
              </div>
            </button>

            {isOpen && <JourneyDetail journey={journey} />}
          </li>
        );
      })}
    </ul>
  );
}
