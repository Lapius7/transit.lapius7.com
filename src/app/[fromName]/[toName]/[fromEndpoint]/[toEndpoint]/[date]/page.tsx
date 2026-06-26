"use client";

import { useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SearchForm, type SearchFormValues } from "@/components/SearchForm";
import { JourneySearchResult } from "@/components/JourneySearchResult";
import { buildSearchUrl } from "@/lib/searchUrl";
import type { PlanSearchParams, PlanType, SearchStrategy, TransitMode } from "@/lib/types";

export default function SearchResultPage() {
  const params = useParams<{
    fromName: string;
    toName: string;
    fromEndpoint: string;
    toEndpoint: string;
    date: string;
  }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const fromName = decodeURIComponent(params.fromName);
  const toName = decodeURIComponent(params.toName);
  const fromEndpoint = decodeURIComponent(params.fromEndpoint);
  const toEndpoint = decodeURIComponent(params.toEndpoint);
  const date = decodeURIComponent(params.date);

  const time = searchParams.get("time") ?? undefined;
  const type = (searchParams.get("type") as PlanType) ?? undefined;
  const maxTransfers = searchParams.get("maxTransfers")
    ? Number(searchParams.get("maxTransfers"))
    : undefined;
  const strategy = (searchParams.get("strategy") as SearchStrategy) ?? undefined;
  const avoidWalk = (searchParams.get("avoidWalk") as "true" | "false") ?? undefined;
  const avoidModes = searchParams.get("avoidModes") ?? undefined;

  const planParams = useMemo<PlanSearchParams>(
    () => ({
      from: fromEndpoint,
      to: toEndpoint,
      date,
      time,
      type,
      maxTransfers,
      numItineraries: 5,
      strategy,
      avoidWalk,
      avoidModes,
    }),
    [fromEndpoint, toEndpoint, date, time, type, maxTransfers, strategy, avoidWalk, avoidModes],
  );

  const initialValues: Partial<SearchFormValues> = {
    from: { endpoint: fromEndpoint, name: fromName },
    to: { endpoint: toEndpoint, name: toName },
    date,
    time: time ?? "",
    type,
    maxTransfers,
    strategy,
    avoidWalk: avoidWalk === "true",
    avoidModes: (avoidModes?.split(",").filter(Boolean) as TransitMode[] | undefined) ?? [],
  };

  function handleSearch(
    nextParams: PlanSearchParams,
    nextFromName: string,
    nextToName: string,
  ) {
    router.push(buildSearchUrl(nextParams, nextFromName, nextToName));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">乗換案内</h1>
      <p className="mb-6 text-sm text-slate-500">
        駅・バス停・施設・住所から経路を検索できます。
      </p>

      <SearchForm initialValues={initialValues} onSearch={handleSearch} />

      <div className="mt-6">
        <JourneySearchResult params={planParams} fromName={fromName} toName={toName} />
      </div>
    </div>
  );
}
