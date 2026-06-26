import { LegStep } from "./LegStep";
import type { Journey } from "@/lib/types";

interface JourneyDetailProps {
  journey: Journey;
}

export function JourneyDetail({ journey }: JourneyDetailProps) {
  return (
    <div className="border-t border-slate-100 px-4 py-4">
      <ol>
        {journey.legs.map((leg, i) => (
          <LegStep key={i} leg={leg} isLast={i === journey.legs.length - 1} />
        ))}
      </ol>

      {journey.coverage && journey.coverage.notices.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {journey.coverage.notices.map((notice, i) => (
            <p
              key={i}
              className={`rounded-md px-3 py-2 text-xs ${
                notice.severity === "warning"
                  ? "bg-amber-50 text-amber-800"
                  : "bg-slate-50 text-slate-600"
              }`}
            >
              {notice.message}
            </p>
          ))}
        </div>
      )}

      {journey.coverage && journey.coverage.feeds.length > 0 && (
        <p className="mt-3 text-xs text-slate-400">
          データ提供:{" "}
          {journey.coverage.feeds.map((f) => f.name).join("、")}
        </p>
      )}
    </div>
  );
}
