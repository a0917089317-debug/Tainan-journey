import type { LatLng } from "@/lib/route-optimizer";

// OpenStreetMap Nominatim: free, but max 1 request/second and must identify us.
// https://operations.osmfoundation.org/policies/nominatim/
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "tainan-journey/1.0 (https://github.com/a0917089317-debug/Tainan-journey)";
const MIN_INTERVAL_MS = 1100;
const MAX_PLACES = 12;

type Place = { name: string; region: string; district: string; country: "taiwan" | "japan" };
type Result = (LatLng & { approximate: boolean }) | null;

const cache = new Map<string, LatLng | null>();
let lastRequestAt = 0;

async function search(query: string, countryCode: string): Promise<LatLng | null> {
  const cacheKey = `${countryCode}|${query}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastRequestAt = Date.now();

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "1",
    countrycodes: countryCode,
    "accept-language": "zh-TW",
  });
  try {
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) return null; // don't cache failures, they may be rate limits
    const [hit] = await res.json();
    const result = hit ? { lat: Number(hit.lat), lng: Number(hit.lon) } : null;
    cache.set(cacheKey, result);
    return result;
  } catch {
    return null;
  }
}

async function geocode(place: Place): Promise<Result> {
  const countryCode = place.country === "japan" ? "jp" : "tw";
  const city = place.region.replace(/[市縣都府道]$/, "");

  for (const query of [`${place.name} ${city}`, place.name]) {
    const hit = await search(query, countryCode);
    if (hit) return { ...hit, approximate: false };
  }
  // Fall back to the district centre so the stop can still be ordered.
  const area = await search(`${place.district} ${place.region}`, countryCode);
  return area ? { ...area, approximate: true } : null;
}

function isPlace(value: unknown): value is Place {
  const p = value as Place;
  return (
    typeof p?.name === "string" &&
    typeof p.region === "string" &&
    typeof p.district === "string" &&
    (p.country === "taiwan" || p.country === "japan")
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const places: unknown = body?.places;
  if (!Array.isArray(places) || places.length === 0 || !places.every(isPlace)) {
    return Response.json({ error: "請求格式錯誤" }, { status: 400 });
  }
  if (places.length > MAX_PLACES) {
    return Response.json({ error: `一次最多計算 ${MAX_PLACES} 個地點` }, { status: 400 });
  }

  const results: Result[] = [];
  for (const place of places) {
    results.push(await geocode(place));
  }
  return Response.json({ results });
}
