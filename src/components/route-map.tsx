"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "@/lib/route-optimizer";

// OSRM public demo server: free, no key, CORS enabled. Light use only.
// https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";
const ROUTE_COLOR = "#1a73e8";

export type MapStop = LatLng & { label: string; start?: boolean };

function markerHtml(stop: MapStop) {
  const bg = stop.start ? "#0ea5e9" : ROUTE_COLOR;
  return `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:9999px;background:${bg};color:#fff;font-size:12px;font-weight:600;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)">${stop.label}</div>`;
}

/** Leaflet map drawing the road route (blue line) through `stops` in order. */
export function RouteMap({ stops }: { stops: MapStop[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "road" | "straight">("loading");
  // Stable dependency: only redraw when the stops actually change.
  const stopsJson = JSON.stringify(stops);

  useEffect(() => {
    const points: MapStop[] = JSON.parse(stopsJson);
    let cancelled = false;
    let map: LeafletMap | undefined;

    (async () => {
      // Leaflet touches `window` on import, so load it only in the browser.
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || points.length === 0) return;
      setStatus("loading");

      map = L.map(containerRef.current, { scrollWheelZoom: false });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      const latLngs = points.map((p) => L.latLng(p.lat, p.lng));
      points.forEach((p, i) => {
        L.marker(latLngs[i], {
          icon: L.divIcon({ html: markerHtml(p), className: "", iconSize: [24, 24] }),
          zIndexOffset: points.length - i,
        }).addTo(map!);
      });

      if (points.length === 1) {
        map.setView(latLngs[0], 15);
        setStatus("road");
        return;
      }
      map.fitBounds(L.latLngBounds(latLngs), { padding: [30, 30] });

      try {
        const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
        const res = await fetch(`${OSRM_URL}/${coords}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.code !== "Ok") throw new Error(data.code);
        if (cancelled) return;
        const line = (data.routes[0].geometry.coordinates as [number, number][]).map(
          ([lng, lat]) => L.latLng(lat, lng),
        );
        const route = L.polyline(line, { color: ROUTE_COLOR, weight: 5, opacity: 0.85 }).addTo(map);
        map.fitBounds(route.getBounds(), { padding: [30, 30] });
        setStatus("road");
      } catch {
        if (cancelled) return;
        L.polyline(latLngs, { color: ROUTE_COLOR, weight: 3, dashArray: "6 8" }).addTo(map);
        setStatus("straight");
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [stopsJson]);

  return (
    <div className="mt-4">
      <div
        ref={containerRef}
        className="isolate h-72 w-full overflow-hidden rounded-xl border border-border"
      />
      <p className="mt-1 text-xs text-muted">
        {status === "loading" && "路線規劃中…"}
        {status === "road" && "藍線為開車路線估算，實際導航請用上方 Google 地圖連結"}
        {status === "straight" && "暫時查不到道路路線，先以虛線連接各站"}
      </p>
    </div>
  );
}
