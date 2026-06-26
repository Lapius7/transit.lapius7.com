"use client";

import { useState } from "react";
import { PlaceAutocomplete, type PlaceValue } from "./PlaceAutocomplete";
import { CurrentLocationButton } from "./CurrentLocationButton";
import { ALL_MODES, MODE_LABELS, PLAN_TYPE_LABELS, STRATEGY_LABELS } from "@/lib/modes";
import { inputDateToYYYYMMDD, todayYYYYMMDD, yyyymmddToInputDate } from "@/lib/time";
import type { PlanSearchParams, PlanType, SearchStrategy, TransitMode } from "@/lib/types";

export interface SearchFormValues {
  from: PlaceValue | null;
  to: PlaceValue | null;
  date: string;
  time: string;
  type: PlanType;
  maxTransfers: number;
  strategy: SearchStrategy;
  avoidWalk: boolean;
  avoidModes: TransitMode[];
}

interface SearchFormProps {
  initialValues?: Partial<SearchFormValues>;
  onSearch: (params: PlanSearchParams, fromName: string, toName: string) => void;
  isSearching?: boolean;
}

const DEFAULT_VALUES: SearchFormValues = {
  from: null,
  to: null,
  date: todayYYYYMMDD(),
  time: "",
  type: "departure",
  maxTransfers: 3,
  strategy: "balanced",
  avoidWalk: false,
  avoidModes: [],
};

export function SearchForm({ initialValues, onSearch, isSearching }: SearchFormProps) {
  const [values, setValues] = useState<SearchFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // from/toの値を外部要因(候補選択・現在地・入れ替え)で確定させたときだけ
  // 増やし、PlaceAutocompleteをkey経由で再マウントして表示を同期する。
  // ユーザーの入力中(onChange(null))ではインクリメントしない。
  const [fromVersion, setFromVersion] = useState(0);
  const [toVersion, setToVersion] = useState(0);

  function update<K extends keyof SearchFormValues>(key: K, value: SearchFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function setFrom(value: PlaceValue | null) {
    setValues((prev) => ({ ...prev, from: value }));
    if (value) setFromVersion((v) => v + 1);
  }

  function setTo(value: PlaceValue | null) {
    setValues((prev) => ({ ...prev, to: value }));
    if (value) setToVersion((v) => v + 1);
  }

  function toggleAvoidMode(mode: TransitMode) {
    setValues((prev) => ({
      ...prev,
      avoidModes: prev.avoidModes.includes(mode)
        ? prev.avoidModes.filter((m) => m !== mode)
        : [...prev.avoidModes, mode],
    }));
  }

  function handleSwap() {
    setValues((prev) => ({ ...prev, from: prev.to, to: prev.from }));
    setFromVersion((v) => v + 1);
    setToVersion((v) => v + 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.from || !values.to) {
      setError("出発地と目的地を選択してください");
      return;
    }
    setError(null);
    onSearch(
      {
        from: values.from.endpoint,
        to: values.to.endpoint,
        date: values.date,
        time: values.time || undefined,
        type: values.type,
        maxTransfers: values.maxTransfers,
        numItineraries: 5,
        strategy: values.strategy,
        avoidWalk: values.avoidWalk ? "true" : "false",
        avoidModes: values.avoidModes.length > 0 ? values.avoidModes.join(",") : undefined,
      },
      values.from.name,
      values.to.name,
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <PlaceAutocomplete
          key={`from-${fromVersion}`}
          label="出発地"
          placeholder="駅名・住所・施設名"
          value={values.from}
          onChange={setFrom}
        />
        <button
          type="button"
          onClick={handleSwap}
          aria-label="出発地と目的地を入れ替える"
          className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:border-teal-400 hover:text-teal-600 sm:mb-0.5"
        >
          ⇄
        </button>
        <PlaceAutocomplete
          key={`to-${toVersion}`}
          label="目的地"
          placeholder="駅名・住所・施設名"
          value={values.to}
          onChange={setTo}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <CurrentLocationButton onResolved={setFrom} />
        <span className="text-xs text-slate-400">を出発地に設定</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">日付</label>
          <input
            type="date"
            value={yyyymmddToInputDate(values.date)}
            onChange={(e) => update("date", inputDateToYYYYMMDD(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">時刻</label>
          <input
            type="time"
            value={values.time}
            onChange={(e) => update("time", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">基準</label>
          <select
            value={values.type}
            onChange={(e) => update("type", e.target.value as PlanType)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          >
            {Object.entries(PLAN_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setIsAdvancedOpen((v) => !v)}
          className="text-xs font-medium text-teal-700 hover:underline"
        >
          {isAdvancedOpen ? "詳細オプションを閉じる ▲" : "詳細オプション ▼"}
        </button>
      </div>

      {isAdvancedOpen && (
        <div className="space-y-4 rounded-xl bg-slate-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">検索の優先順位</label>
              <select
                value={values.strategy}
                onChange={(e) => update("strategy", e.target.value as SearchStrategy)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                {Object.entries(STRATEGY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                最大乗換回数: {values.maxTransfers}
              </label>
              <input
                type="range"
                min={0}
                max={8}
                value={values.maxTransfers}
                onChange={(e) => update("maxTransfers", Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={values.avoidWalk}
              onChange={(e) => update("avoidWalk", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            徒歩を含む経路を避ける
          </label>

          <div>
            <span className="mb-1.5 block text-xs font-medium text-slate-500">避けたい交通モード</span>
            <div className="flex flex-wrap gap-2">
              {ALL_MODES.map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => toggleAvoidMode(mode)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    values.avoidModes.includes(mode)
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-slate-300 text-slate-600 hover:border-teal-400"
                  }`}
                >
                  {MODE_LABELS[mode]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSearching}
        className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
      >
        {isSearching ? "検索中…" : "検索する"}
      </button>
    </form>
  );
}
