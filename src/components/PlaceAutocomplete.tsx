"use client";

import { useEffect, useId, useRef, useState } from "react";
import { suggestPlaces } from "@/lib/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { PlaceSuggestion } from "@/lib/types";

export interface PlaceValue {
  endpoint: string;
  name: string;
}

interface PlaceAutocompleteProps {
  label: string;
  placeholder?: string;
  value: PlaceValue | null;
  onChange: (value: PlaceValue | null) => void;
}

/**
 * value(選択済みの場所)が外部から変わったときは、呼び出し側が
 * key prop を変えてこのコンポーネントを再マウントすることを前提とした
 * 非制御コンポーネント。レンダー中にrefやpropsからstateを同期する
 * アンチパターンを避けるため、内部のqueryはこのコンポーネント自身が
 * 完全に所有する。
 */
export function PlaceAutocomplete({
  label,
  placeholder,
  value,
  onChange,
}: PlaceAutocompleteProps) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 250);
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const skipNextFetch = useRef(false);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    if (trimmed.length === 0) {
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    suggestPlaces(trimmed, 8)
      .then((res) => {
        if (!cancelled) setSuggestions(res.places);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(place: PlaceSuggestion) {
    skipNextFetch.current = true;
    setQuery(place.name);
    setIsOpen(false);
    onChange({ endpoint: place.endpoint, name: place.name });
  }

  return (
    <div className="relative" ref={containerRef}>
      <label htmlFor={inputId} className="mb-1 block text-xs font-medium text-slate-500">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        autoComplete="off"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          if (value) onChange(null);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      />
      {isOpen && (query.trim().length > 0) && (
        <ul className="absolute z-20 mt-1 w-full max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {isLoading && (
            <li className="px-3 py-2 text-sm text-slate-400">検索中…</li>
          )}
          {!isLoading && suggestions.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-400">候補が見つかりません</li>
          )}
          {!isLoading &&
            suggestions.map((place) => (
              <li key={place.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(place)}
                  className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-teal-50"
                >
                  <span className="mt-0.5 text-slate-400">
                    {place.kind === "station" ? "🚉" : "📍"}
                  </span>
                  <span className="flex-1">
                    <span className="block text-slate-900">{place.name}</span>
                    {place.description && (
                      <span className="block text-xs text-slate-400">
                        {place.description}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
