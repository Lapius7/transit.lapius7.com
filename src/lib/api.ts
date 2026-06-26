import type {
  DeparturesResponse,
  FeedListResponse,
  LocationSuggestResponse,
  OperatorBrandingResponse,
  PlaceReverseResponse,
  PlaceSuggestResponse,
  PlanResponse,
  PlanSearchParams,
  StationDetail,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.transit.ls8h.com";

export class ApiRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

async function getJSON<T>(
  path: string,
  params?: Record<string, string | number | string[] | undefined>,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const v of value) url.searchParams.append(key, v);
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiRequestError(
      res.status,
      body || `Transit APIへのリクエストに失敗しました (HTTP ${res.status})`,
    );
  }
  return res.json() as Promise<T>;
}

export function suggestPlaces(q: string, limit = 10) {
  return getJSON<PlaceSuggestResponse>("/api/v1/places/suggest", { q, limit });
}

export function suggestLocations(q: string, limit = 10) {
  return getJSON<LocationSuggestResponse>("/api/v1/locations/suggest", {
    q,
    limit,
  });
}

export function reversePlaces(
  lat: number,
  lon: number,
  limit = 3,
  radiusMeters = 80,
) {
  return getJSON<PlaceReverseResponse>("/api/v1/places/reverse", {
    lat,
    lon,
    limit,
    radiusMeters,
  });
}

export function getStation(id: string) {
  return getJSON<StationDetail>(`/api/v1/stations/${encodeURIComponent(id)}`);
}

export function getDepartures(
  id: string,
  options?: { date?: string; time?: string; limit?: number },
) {
  return getJSON<DeparturesResponse>(
    `/api/v1/stations/${encodeURIComponent(id)}/departures`,
    options,
  );
}

export function planJourney(params: PlanSearchParams) {
  return getJSON<PlanResponse>("/api/v1/plan", {
    from: params.from,
    to: params.to,
    date: params.date,
    time: params.time,
    type: params.type,
    via: params.via,
    viaLabel: params.viaLabel,
    allowModes: params.allowModes,
    avoidModes: params.avoidModes,
    avoidWalk: params.avoidWalk,
    maxTransfers: params.maxTransfers,
    numItineraries: params.numItineraries,
    strategy: params.strategy,
  });
}

export function getFeeds() {
  return getJSON<FeedListResponse>("/api/v1/feeds");
}

export function getOperators() {
  return getJSON<OperatorBrandingResponse>("/api/v1/operators");
}
