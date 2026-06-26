"use client";

import { useEffect, useState } from "react";
import { JourneyList } from "./JourneyList";
import { ApiRequestError, planJourney } from "@/lib/api";
import { hasMissingLocalTransitData } from "@/lib/journeyWarnings";
import type { PlanResponse, PlanSearchParams } from "@/lib/types";

interface JourneySearchResultProps {
  params: PlanSearchParams;
  fromName: string;
  toName: string;
}

export function JourneySearchResult({ params, fromName, toName }: JourneySearchResultProps) {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsSearching(true);
    setSearchError(null);
    planJourney(params)
      .then((result) => {
        if (cancelled) return;
        setPlan(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setPlan(null);
        if (err instanceof ApiRequestError) {
          setSearchError(
            err.status === 404
              ? "経路が見つかりませんでした。出発地・目的地を確認してください。"
              : "検索中にエラーが発生しました。時間をおいて再度お試しください。",
          );
        } else {
          setSearchError("検索中にエラーが発生しました。");
        }
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });
    return () => {
      cancelled = true;
    };
    // paramsは呼び出し側でuseMemoにより安定した参照として渡される前提
  }, [params]);

  if (isSearching) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        検索中…
      </p>
    );
  }

  if (searchError) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        {searchError}
      </p>
    );
  }

  if (!plan) return null;

  return (
    <div>
      <p className="mb-3 text-sm text-slate-500">
        {fromName} → {toName} の経路
      </p>
      {hasMissingLocalTransitData(plan.journeys) && (
        <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          この区間は徒歩のみのアクセスが必要な経路しか見つかりませんでした。お住まいの地域のバス路線がデータに含まれていない可能性があります。実際にはバスを利用できる場合があります。
        </p>
      )}
      <JourneyList journeys={plan.journeys} />
    </div>
  );
}
