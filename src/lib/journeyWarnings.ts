import type { Journey } from "./types";

const LONG_WALK_THRESHOLD_SECS = 1200;

function isWalkOnly(journey: Journey): boolean {
  return journey.legs.every((leg) => leg.kind === "walk");
}

function hasExcessiveAccessWalk(journey: Journey): boolean {
  return (
    isWalkOnly(journey) ||
    (journey.accessWalkSecs ?? 0) > LONG_WALK_THRESHOLD_SECS ||
    (journey.egressWalkSecs ?? 0) > LONG_WALK_THRESHOLD_SECS
  );
}

/**
 * 全ての候補経路が長距離徒歩アクセスを要する場合、出発地・目的地周辺の
 * バス等のデータがフィードに含まれていない可能性が高いと判断する。
 * 一部の経路だけ該当する場合は他の経路を使えるため警告は出さない。
 */
export function hasMissingLocalTransitData(journeys: Journey[]): boolean {
  return journeys.length > 0 && journeys.every(hasExcessiveAccessWalk);
}
