/**
 * secsOfDay はサービス日0時からの秒数。86400を超える(翌日扱いの深夜運行)や
 * 負値(前日サービスの継続)もありうるため、表示用に正規化して変換する。
 */
export function secsToClock(secsOfDay: number): string {
  const normalized = ((secsOfDay % 86400) + 86400) % 86400;
  const hours = Math.floor(normalized / 3600);
  const minutes = Math.floor((normalized % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function secsToDayOffsetClock(secsOfDay: number): string {
  const dayOffset = Math.floor(secsOfDay / 86400);
  const clock = secsToClock(secsOfDay);
  if (dayOffset === 0) return clock;
  if (dayOffset > 0) return `翌${clock}`;
  return `前日${clock}`;
}

export function secsToDuration(durationSecs: number): string {
  const mins = Math.round(durationSecs / 60);
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hours === 0) return `${remMins}分`;
  return `${hours}時間${remMins}分`;
}

export function todayYYYYMMDD(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function nowHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;
}

export function yyyymmddToInputDate(value: string): string {
  if (!/^\d{8}$/.test(value)) return value;
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

export function inputDateToYYYYMMDD(value: string): string {
  return value.replaceAll("-", "");
}
