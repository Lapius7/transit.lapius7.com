import type { PlanSearchParams } from "./types";

/**
 * 検索結果ページのURLを構築する。
 * 例: /渋谷/新宿/geo%3A35.65..%2C139.70../geo%3A35.68..%2C139.69../20260626?type=departure&maxTransfers=3
 */
export function buildSearchUrl(
  params: PlanSearchParams,
  fromName: string,
  toName: string,
): string {
  const date = params.date ?? "";
  const path = [
    encodeURIComponent(fromName),
    encodeURIComponent(toName),
    encodeURIComponent(params.from),
    encodeURIComponent(params.to),
    encodeURIComponent(date),
  ].join("/");

  const query = new URLSearchParams();
  if (params.time) query.set("time", params.time);
  if (params.type) query.set("type", params.type);
  if (params.maxTransfers !== undefined) query.set("maxTransfers", String(params.maxTransfers));
  if (params.strategy) query.set("strategy", params.strategy);
  if (params.avoidWalk) query.set("avoidWalk", params.avoidWalk);
  if (params.avoidModes) query.set("avoidModes", params.avoidModes);

  const queryString = query.toString();
  return queryString ? `/${path}?${queryString}` : `/${path}`;
}
