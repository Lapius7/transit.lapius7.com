import type { TransitMode } from "./types";

export const MODE_LABELS: Record<TransitMode, string> = {
  tram: "路面電車",
  subway: "地下鉄",
  rail: "電車",
  bus: "バス",
  ferry: "フェリー",
  cableTram: "ケーブルカー",
  aerialLift: "ロープウェイ",
  funicular: "ケーブル鉄道",
  trolleybus: "トロリーバス",
  monorail: "モノレール",
  air: "飛行機",
};

export const MODE_FALLBACK_COLORS: Record<TransitMode, string> = {
  tram: "#6b7280",
  subway: "#1d4ed8",
  rail: "#0f766e",
  bus: "#b45309",
  ferry: "#0369a1",
  cableTram: "#7c3aed",
  aerialLift: "#7c3aed",
  funicular: "#7c3aed",
  trolleybus: "#b45309",
  monorail: "#be185d",
  air: "#475569",
};

export function modeLabel(mode: TransitMode | string): string {
  return MODE_LABELS[mode as TransitMode] ?? mode;
}

export function modeColor(mode: TransitMode | string, color?: string): string {
  if (color) return color.startsWith("#") ? color : `#${color}`;
  return MODE_FALLBACK_COLORS[mode as TransitMode] ?? "#374151";
}

export const ALL_MODES: TransitMode[] = [
  "rail",
  "subway",
  "monorail",
  "tram",
  "bus",
  "trolleybus",
  "ferry",
  "cableTram",
  "aerialLift",
  "funicular",
  "air",
];

export const STRATEGY_LABELS: Record<string, string> = {
  balanced: "バランス重視",
  fastest: "最速",
  fewestTransfers: "乗換が少ない",
  lowestFare: "安い順",
  shortestWalk: "徒歩が少ない",
};

export const PLAN_TYPE_LABELS: Record<string, string> = {
  departure: "出発",
  arrival: "到着",
  first: "始発",
  last: "終電",
};
