"use client";

import { useEffect, useState } from "react";
import type { Country, RegionHighlights, TransportId } from "@/lib/journey-options";
import { distanceKm, shortestPath, totalKm, type LatLng } from "@/lib/route-optimizer";

type Geocoded = (LatLng & { approximate: boolean }) | null;

const MAX_GEOCODE = 12;

async function fetchCoords(targets: Stop[], country: Country) {
  const res = await fetch("/api/geocode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      places: targets.map((s) => ({
        name: s.name,
        region: s.region,
        district: s.district,
        country,
      })),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "查詢座標失敗");
  return Object.fromEntries(
    targets.map((s, i) => [s.key, (data.results[i] ?? null) as Geocoded]),
  );
}

function parseLatLng(value: string): LatLng {
  const [lat, lng] = value.split(",").map(Number);
  return { lat, lng };
}

function formatKm(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} 公尺` : `${km.toFixed(1)} 公里`;
}

type Category = "spots" | "foods";

const categories: { id: Category; label: string }[] = [
  { id: "spots", label: "景點" },
  { id: "foods", label: "小吃／名店" },
];

type Stop = {
  key: string;
  name: string;
  region: string;
  district: string;
  category: Category;
};

// Google Maps URLs can't route scooters, and transit ignores waypoints,
// so public transport is linked leg by leg instead of as one route.
const travelModes: Record<TransportId, "driving" | "transit"> = {
  drive: "driving",
  "rail-rent": "driving",
  "rail-public": "transit",
};

const MAX_WAYPOINTS = 9;

function stopKey(region: string, district: string, name: string) {
  return `${region}|${district}|${name}`;
}

function placeQuery(stop: Stop) {
  return `${stop.name} ${stop.region}${stop.district}`;
}

// `points` are place names or "lat,lng" strings, in visiting order.
function directionsUrl(points: string[], mode: string) {
  const params = new URLSearchParams({
    api: "1",
    origin: points[0],
    destination: points[points.length - 1],
    travelmode: mode,
  });
  const middle = points.slice(1, -1).slice(0, MAX_WAYPOINTS);
  if (middle.length > 0) params.set("waypoints", middle.join("|"));
  return `https://www.google.com/maps/dir/?${params}`;
}

function pillClass(active: boolean) {
  return `rounded-full border px-4 py-1.5 text-sm transition-colors ${
    active
      ? "border-accent bg-accent text-background"
      : "border-border text-muted hover:text-foreground"
  }`;
}

export function RegionHighlightsMenu({
  regions,
  transport,
  country,
}: {
  regions: RegionHighlights[];
  transport: TransportId;
  country: Country;
}) {
  const [regionIndex, setRegionIndex] = useState(0);
  const [districtIndex, setDistrictIndex] = useState(0);
  const [category, setCategory] = useState<Category>("spots");
  const [stops, setStops] = useState<Stop[]>([]);
  const [myLocation, setMyLocation] = useState<string | null>(null);
  const [locStatus, setLocStatus] = useState<"idle" | "locating" | "error">("idle");
  const [coords, setCoords] = useState<Record<string, Geocoded>>({});
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedKey, setOptimizedKey] = useState<string | null>(null);
  const [optError, setOptError] = useState("");

  // Locate newly added stops so the map can draw the route.
  useEffect(() => {
    const missing = stops.filter((s) => !(s.key in coords)).slice(0, MAX_GEOCODE);
    if (missing.length === 0) return;
    // Debounced: the geocoder allows ~1 lookup/second.
    const timer = setTimeout(() => {
      fetchCoords(missing, country)
        .then((found) => setCoords((prev) => ({ ...prev, ...found })))
        .catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, [stops, coords, country]);

  const region = regions[regionIndex];
  if (!region) return null;
  const district = region.districts[districtIndex];
  const items = district?.[category] ?? [];
  const mode = travelModes[transport];
  const selectedKeys = new Set(stops.map((s) => s.key));

  const routePoints = [...(myLocation ? [myLocation] : []), ...stops.map(placeQuery)];
  const wholeRouteMode = mode === "transit" && routePoints.length > 2 ? "driving" : mode;
  const legLabel = mode === "transit" ? "大眾運輸路線" : "開車路線";

  const myLatLng = myLocation ? parseLatLng(myLocation) : null;
  const coordOf = (stop: Stop) => coords[stop.key] ?? null;
  const routeKey = routePoints.join("|");
  const isOptimized = optimizedKey === routeKey;
  const routeCoords = [
    ...(myLatLng ? [myLatLng] : []),
    ...stops.map(coordOf),
  ];
  const allLocated = routeCoords.every((c): c is NonNullable<typeof c> => c !== null);

  function legKm(a: LatLng | null, b: LatLng | null) {
    return a && b ? ` 約 ${formatKm(distanceKm(a, b))}` : "";
  }

  async function optimizeRoute() {
    if (stops.length > MAX_GEOCODE) {
      setOptError(`一次最多計算 ${MAX_GEOCODE} 個地點，請先移除幾站`);
      return;
    }
    setOptimizing(true);
    setOptError("");
    try {
      const missing = stops.filter((s) => !(s.key in coords));
      let found = coords;
      if (missing.length > 0) {
        found = { ...coords, ...(await fetchCoords(missing, country)) };
        setCoords(found);
      }

      const located = stops.filter((s) => found[s.key]);
      const unlocated = stops.filter((s) => !found[s.key]);
      const points = [
        ...(myLatLng ? [myLatLng] : []),
        ...located.map((s) => found[s.key]!),
      ];
      const order = shortestPath(points, myLatLng !== null);
      const offset = myLatLng ? 1 : 0;
      const reordered = [
        ...order.filter((i) => i >= offset).map((i) => located[i - offset]),
        ...unlocated,
      ];
      setStops(reordered);
      setOptimizedKey(
        [...(myLocation ? [myLocation] : []), ...reordered.map(placeQuery)].join("|"),
      );
      if (unlocated.length > 0) {
        setOptError(`找不到位置，已排在最後：${unlocated.map((s) => s.name).join("、")}`);
      }
    } catch (err) {
      setOptError(err instanceof Error ? err.message : "計算失敗");
    } finally {
      setOptimizing(false);
    }
  }

  function locateMe() {
    if (!navigator.geolocation) {
      setLocStatus("error");
      return;
    }
    setLocStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMyLocation(`${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`);
        setLocStatus("idle");
      },
      () => setLocStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function toggleStop(stop: Omit<Stop, "key">) {
    const key = stopKey(stop.region, stop.district, stop.name);
    setStops((prev) =>
      prev.some((s) => s.key === key)
        ? prev.filter((s) => s.key !== key)
        : [...prev, { ...stop, key }],
    );
  }

  function moveStop(index: number, delta: number) {
    setStops((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  // Unselected items from the districts already on the route.
  const routeDistricts = new Set(stops.map((s) => `${s.region}|${s.district}`));
  const recommendations: Omit<Stop, "key">[] = regions.flatMap((r) =>
    r.districts
      .filter((d) => routeDistricts.has(`${r.name}|${d.name}`))
      .flatMap((d) =>
        categories.flatMap((c) =>
          d[c.id].map((name) => ({ name, region: r.name, district: d.name, category: c.id })),
        ),
      ),
  ).filter((s) => !selectedKeys.has(stopKey(s.region, s.district, s.name)));

  return (
    <section className="rounded-2xl border border-border bg-background-elevated p-6">
      <h2 className="font-[family-name:var(--font-serif-tc)] text-xl text-accent">
        各區景點／小吃
      </h2>
      <p className="mt-1 text-xs text-muted">勾選想去的景點與店家，下方會自動排出 Google 地圖路線</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {regions.map((r, i) => (
          <button
            key={r.name}
            type="button"
            onClick={() => {
              setRegionIndex(i);
              setDistrictIndex(0);
            }}
            className={pillClass(i === regionIndex)}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {region.districts.map((d, i) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setDistrictIndex(i)}
            className={`rounded-lg border px-3 py-1 text-xs transition-colors ${
              i === districtIndex
                ? "border-accent text-accent"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {district && (
        <div className="mt-5 rounded-xl border border-border p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 font-medium">{district.name}</span>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={pillClass(category === c.id)}
              >
                {c.label}（{district[c.id].length}）
              </button>
            ))}
          </div>

          {items.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {items.map((name) => {
                const checked = selectedKeys.has(stopKey(region.name, district.name, name));
                return (
                  <label
                    key={name}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors ${
                      checked
                        ? "border-accent bg-accent/15 text-foreground"
                        : "border-border text-muted hover:text-foreground"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        toggleStop({ name, region: region.name, district: district.name, category })
                      }
                      className="mr-1.5 accent-[var(--accent)]"
                    />
                    {name}
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-xs text-muted">這一區暫無資料</p>
          )}
        </div>
      )}

      {stops.length > 0 && (
        <div className="mt-6 grid gap-6 border-t border-border pt-6 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-[family-name:var(--font-serif-tc)] text-lg">
                我的路線（{stops.length} 站）
              </h3>
              {routePoints.length > 1 && (
                <a
                  href={directionsUrl(routePoints, wholeRouteMode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-background"
                >
                  在 Google 地圖開啟整條路線 ↗
                </a>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={optimizeRoute}
                disabled={optimizing || routePoints.length < 3}
                className="rounded-full border border-emerald-500/50 bg-emerald-500/15 px-4 py-1.5 text-xs text-emerald-400 transition-colors hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {optimizing ? "計算最短路線中…" : "⚡ 排出最短路線"}
              </button>
              {isOptimized && allLocated && (
                <span className="text-xs text-emerald-400">
                  ✓ 已是最短順序，全程直線距離約 {formatKm(totalKm(routeCoords as LatLng[]))}
                </span>
              )}
              {routePoints.length < 3 && (
                <span className="text-xs text-muted">至少 3 個點（含你的位置）才需要排順序</span>
              )}
            </div>
            {optError && <p className="mt-2 text-xs text-amber-300">{optError}</p>}
            {Object.values(coords).some((c) => c?.approximate) && (
              <p className="mt-3 rounded-lg border border-amber-400/60 bg-amber-400/15 px-3 py-2 text-sm text-amber-200">
                ⚠️ 部分地點找不到精確位置，以所在行政區估算。如果該景點只顯示 XX 區，請刪除該景點，否則無法顯示藍色線的路線圖。
              </p>
            )}
            {mode === "transit" && routePoints.length > 2 && (
              <p className="mt-2 text-xs text-muted">
                大眾運輸無法一次排多站，整條路線會以開車顯示；請用每段的「大眾運輸路線」查詢。
              </p>
            )}
            {routePoints.length > MAX_WAYPOINTS + 2 && (
              <p className="mt-2 text-xs text-amber-300">
                Google 地圖最多一次排 {MAX_WAYPOINTS + 2} 站，超過的中途站不會出現在整條路線中。
              </p>
            )}

            <div className="mt-4">
              {myLocation ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-sky-500/50 bg-sky-500/10 px-3 py-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs text-background">
                      ◎
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">你的位置（起點）</p>
                      <p className="text-xs text-muted">{myLocation}</p>
                    </div>
                    <button
                      type="button"
                      aria-label="移除起點"
                      onClick={() => setMyLocation(null)}
                      className="px-1 text-muted hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                  <a
                    href={directionsUrl([myLocation, placeQuery(stops[0])], mode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-9 mt-1 inline-block text-xs text-accent hover:underline"
                  >
                    ↓ {legLabel}：你的位置 → {stops[0].name}
                    {legKm(myLatLng, coordOf(stops[0]))} ↗
                  </a>
                </>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={locateMe}
                    disabled={locStatus === "locating"}
                    className="rounded-full border border-sky-500/50 bg-sky-500/15 px-4 py-1.5 text-xs text-sky-400 transition-colors hover:bg-sky-500/25 disabled:opacity-50"
                  >
                    {locStatus === "locating" ? "定位中…" : "◎ 從你的位置出發"}
                  </button>
                  {locStatus === "error" && (
                    <span className="text-xs text-red-300">
                      無法取得位置，請確認瀏覽器已允許定位
                    </span>
                  )}
                </div>
              )}
            </div>

            <ol className="mt-2 flex flex-col gap-2">
              {stops.map((stop, i) => (
                <li key={stop.key}>
                  <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-background">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{stop.name}</p>
                      <p className="text-xs text-muted">
                        {stop.region} {stop.district}．{stop.category === "spots" ? "景點" : "小吃／名店"}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="往上移"
                      onClick={() => moveStop(i, -1)}
                      disabled={i === 0}
                      className="px-1 text-muted hover:text-foreground disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label="往下移"
                      onClick={() => moveStop(i, 1)}
                      disabled={i === stops.length - 1}
                      className="px-1 text-muted hover:text-foreground disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      aria-label="移除"
                      onClick={() => toggleStop(stop)}
                      className="px-1 text-muted hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                  {i < stops.length - 1 && (
                    <a
                      href={directionsUrl([placeQuery(stop), placeQuery(stops[i + 1])], mode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-9 mt-1 inline-block text-xs text-accent hover:underline"
                    >
                      ↓ {legLabel}：{stop.name} → {stops[i + 1].name}
                      {legKm(coordOf(stop), coordOf(stops[i + 1]))} ↗
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <aside>
            <h3 className="font-[family-name:var(--font-serif-tc)] text-lg">名店名景推薦</h3>
            <p className="mt-1 text-xs text-muted">同區還有這些，點一下加入路線</p>
            {recommendations.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2">
                {recommendations.slice(0, 12).map((rec) => (
                  <li
                    key={stopKey(rec.region, rec.district, rec.name)}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                  >
                    <span className="shrink-0 text-xs">{rec.category === "spots" ? "📍" : "🍜"}</span>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(placeQuery({ ...rec, key: "" }))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 flex-1 truncate text-xs hover:text-accent"
                    >
                      {rec.name}
                      <span className="ml-1 text-muted">{rec.district}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleStop(rec)}
                      className="shrink-0 rounded-full border border-accent/40 px-2 text-xs text-accent hover:bg-accent/15"
                    >
                      ＋
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-muted">同區的推薦都已加入路線了</p>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
