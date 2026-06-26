"use client";

import { useRouter } from "next/navigation";
import { SearchForm } from "@/components/SearchForm";
import { buildSearchUrl } from "@/lib/searchUrl";
import type { PlanSearchParams } from "@/lib/types";

export default function Home() {
  const router = useRouter();

  function handleSearch(params: PlanSearchParams, fromName: string, toName: string) {
    router.push(buildSearchUrl(params, fromName, toName));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">乗換案内</h1>
      <p className="mb-6 text-sm text-slate-500">
        駅・バス停・施設・住所から経路を検索できます。
      </p>

      <SearchForm onSearch={handleSearch} />
    </div>
  );
}
