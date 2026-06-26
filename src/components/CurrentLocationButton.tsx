"use client";

import { useState } from "react";
import { reversePlaces } from "@/lib/api";
import type { PlaceValue } from "./PlaceAutocomplete";

interface CurrentLocationButtonProps {
  onResolved: (value: PlaceValue) => void;
}

export function CurrentLocationButton({ onResolved }: CurrentLocationButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  function handleClick() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await reversePlaces(latitude, longitude, 1);
          const place = res.places[0];
          if (place) {
            onResolved({ endpoint: place.endpoint, name: place.name });
          } else {
            onResolved({
              endpoint: `geo:${latitude},${longitude}`,
              name: "現在地",
            });
          }
          setStatus("idle");
        } catch {
          setStatus("error");
        }
      },
      () => setStatus("error"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "loading"}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-teal-400 hover:text-teal-700 disabled:opacity-50"
    >
      <span aria-hidden="true">📍</span>
      {status === "loading" ? "取得中…" : "現在地を使う"}
      {status === "error" && (
        <span className="text-red-500">(取得失敗)</span>
      )}
    </button>
  );
}
