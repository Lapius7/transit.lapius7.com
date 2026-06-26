"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DepartureBoard } from "@/components/DepartureBoard";
import { ModeIcon } from "@/components/ModeIcon";
import { ApiRequestError, getDepartures, getStation } from "@/lib/api";
import { modeColor, modeLabel } from "@/lib/modes";
import { inputDateToYYYYMMDD, todayYYYYMMDD, yyyymmddToInputDate } from "@/lib/time";
import type { DeparturesResponse, StationDetail } from "@/lib/types";

export default function StationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const stationId = decodeURIComponent(params.id);

  const [station, setStation] = useState<StationDetail | null>(null);
  const [departures, setDepartures] = useState<DeparturesResponse | null>(null);
  const [date, setDate] = useState(todayYYYYMMDD());
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    Promise.all([
      getStation(stationId),
      getDepartures(stationId, { date, time: time || undefined, limit: 40 }),
    ])
      .then(([stationRes, departuresRes]) => {
        if (cancelled) return;
        setStation(stationRes);
        setDepartures(departuresRes);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiRequestError
            ? "駅情報の取得に失敗しました。"
            : "通信エラーが発生しました。",
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [stationId, date, time]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 text-sm text-teal-700 hover:underline"
      >
        ← 戻る
      </button>

      {isLoading && !station && <p className="text-sm text-slate-500">読み込み中…</p>}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {error}
        </p>
      )}

      {station && (
        <>
          <h1 className="mb-1 text-2xl font-bold text-slate-900">{station.name}</h1>
          {station.nameKana && <p className="mb-3 text-sm text-slate-400">{station.nameKana}</p>}

          {station.routes.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {station.routes.map((route, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-white"
                  style={{ backgroundColor: modeColor(route.mode, route.color) }}
                >
                  <ModeIcon mode={route.mode} className="h-3 w-3" />
                  {route.name}
                  <span className="opacity-80">({modeLabel(route.mode)})</span>
                </span>
              ))}
            </div>
          )}

          {station.platforms.length > 1 && (
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="mb-2 text-sm font-semibold text-slate-700">プラットフォーム</h2>
              <ul className="space-y-1 text-sm text-slate-600">
                {station.platforms.map((platform, i) => (
                  <li key={i}>
                    {platform.platformCode ? `${platform.platformCode}番線 ` : ""}
                    {platform.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2 className="mb-2 text-lg font-semibold text-slate-900">発車案内</h2>
          <div className="mb-4 flex gap-3">
            <input
              type="date"
              value={yyyymmddToInputDate(date)}
              onChange={(e) => setDate(inputDateToYYYYMMDD(e.target.value))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {departures && <DepartureBoard departures={departures.departures} />}
        </>
      )}
    </div>
  );
}
