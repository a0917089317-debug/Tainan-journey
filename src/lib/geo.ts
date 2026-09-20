export type LatLng = { lat: number; lng: number };

const TILE_SIZE = 256;

/** Standard Web Mercator projection used by Google Maps tiles. */
function projectMercator({ lat, lng }: LatLng) {
  const sin = Math.min(Math.max(Math.sin((lat * Math.PI) / 180), -0.9999), 0.9999);
  const x = TILE_SIZE * (0.5 + lng / 360);
  const y = TILE_SIZE * (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI));
  return { x, y };
}

/**
 * Converts a lat/lng into a percentage position within a map container that is
 * centered on `center` at `zoom`, matching the projection Google Maps embeds use.
 * Clamped so a pin never renders flush against (or past) the container edge.
 */
export function latLngToContainerPercent(
  point: LatLng,
  center: LatLng,
  zoom: number,
  containerWidth: number,
  containerHeight: number,
) {
  const scale = 2 ** zoom;
  const centerPx = projectMercator(center);
  const pointPx = projectMercator(point);

  const dx = (pointPx.x - centerPx.x) * scale;
  const dy = (pointPx.y - centerPx.y) * scale;

  const leftPx = containerWidth / 2 + dx;
  const topPx = containerHeight / 2 + dy;

  const clamp = (px: number, size: number) =>
    Math.min(92, Math.max(8, (px / size) * 100));

  return {
    left: clamp(leftPx, containerWidth),
    top: clamp(topPx, containerHeight),
  };
}
