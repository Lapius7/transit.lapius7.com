export type TransitMode =
  | "tram"
  | "subway"
  | "rail"
  | "bus"
  | "ferry"
  | "cableTram"
  | "aerialLift"
  | "funicular"
  | "trolleybus"
  | "monorail"
  | "air";

export type PlanType = "departure" | "arrival" | "first" | "last";

export type SearchStrategy =
  | "balanced"
  | "fastest"
  | "fewestTransfers"
  | "lowestFare"
  | "shortestWalk";

export interface PlaceSuggestion {
  id: string;
  endpoint: string;
  name: string;
  nameEn?: string;
  kind: "station" | "place" | string;
  source: string;
  lat: number;
  lon: number;
  score: number;
  weight: number;
  description?: string;
}

export interface PlaceSuggestResponse {
  places: PlaceSuggestion[];
}

export interface PlaceReverseResponse {
  places: PlaceSuggestion[];
}

export interface StationSuggestion {
  id: string;
  name: string;
  nameKana?: string;
  feedId: string;
  feedName: string;
  score: number;
  weight: number;
  lat: number;
  lon: number;
  kind: "station";
}

export interface LocationSuggestResponse {
  stations: StationSuggestion[];
}

export interface NamedRef {
  id: string;
  name: string;
}

export interface PlatformRef extends NamedRef {
  platformCode?: string;
}

export interface WalkLeg {
  kind: "walk";
  from: NamedRef;
  to: NamedRef;
  departureSecs: number;
  arrivalSecs: number;
  distanceMeters?: number;
}

export interface TransitLeg {
  kind: "transit";
  routeName: string;
  mode: TransitMode;
  color?: string;
  headsign?: string;
  tripId?: string;
  from: PlatformRef;
  to: PlatformRef;
  departureSecs: number;
  arrivalSecs: number;
}

export type JourneyLeg = WalkLeg | TransitLeg;

export interface JourneyFare {
  currency: string;
  ticket: number;
  ic?: number;
}

export interface FeedCoverage {
  feedId: string;
  name: string;
  transitModes?: TransitMode[];
}

export interface JourneyNotice {
  severity: "info" | "warning";
  code:
    | "loadedDataScope"
    | "stationRailCandidateMissing"
    | "noRouteInLoadedData"
    | "constraintsApplied"
    | "constraintsNoRoute";
  message: string;
  action?: string;
  modes?: TransitMode[];
  walk?: boolean;
}

export interface JourneyCoverage {
  feeds: FeedCoverage[];
  transitModes: TransitMode[];
  notices: JourneyNotice[];
}

export interface Journey {
  departureSecs: number;
  arrivalSecs: number;
  durationSecs: number;
  transferCount: number;
  fare?: JourneyFare;
  accessWalkSecs?: number;
  egressWalkSecs?: number;
  legs: JourneyLeg[];
  coverage?: JourneyCoverage;
}

export interface PlanResponse {
  date: string;
  type: PlanType;
  timezone: string;
  from: NamedRef;
  to: NamedRef;
  journeys: Journey[];
}

export type GuidancePlanResponse = PlanResponse;

export interface StationPlatform extends NamedRef {
  lat: number;
  lon: number;
  platformCode?: string;
}

export interface StationRoute {
  name: string;
  mode: TransitMode;
  color?: string;
}

export interface StationDetail {
  id: string;
  name: string;
  nameKana?: string;
  lat: number;
  lon: number;
  feedId: string;
  platforms: StationPlatform[];
  routes: StationRoute[];
}

export interface Departure {
  routeName: string;
  mode: TransitMode;
  color?: string;
  headsign?: string;
  tripId?: string;
  stopId: string;
  departureSecs: number;
  headwayBased?: boolean;
}

export interface DeparturesResponse {
  stationId: string;
  date: string;
  timezone: string;
  departures: Departure[];
}

export interface FeedInfo {
  feedId: string;
  version?: string;
  fetchedAt?: string;
  name: string;
  license?: string;
  attribution?: string;
  catalog?: string;
  country?: string;
  downloadUrl?: string;
  warningCount?: number;
}

export interface FeedListResponse {
  feeds: FeedInfo[];
}

export interface OperatorInfo {
  id: string;
  name: string;
  nameShort?: string;
  mark?: string;
  feedIds?: string[];
  logoUrl?: string;
  license?: string;
  url?: string;
}

export interface OperatorBrandingResponse {
  generatedAt?: string;
  operators: OperatorInfo[];
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface PlanSearchParams {
  from: string;
  to: string;
  date?: string;
  time?: string;
  type?: PlanType;
  via?: string[];
  viaLabel?: string[];
  allowModes?: string;
  avoidModes?: string;
  avoidWalk?: "true" | "false";
  maxTransfers?: number;
  numItineraries?: number;
  strategy?: SearchStrategy;
}
