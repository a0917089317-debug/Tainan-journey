export type LatLng = { lat: number; lng: number };

// Great-circle distance in km. Straight-line, not road distance.
export function distanceKm(a: LatLng, b: LatLng) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

function pathLength(points: LatLng[], order: number[]) {
  let total = 0;
  for (let i = 1; i < order.length; i++) {
    total += distanceKm(points[order[i - 1]], points[order[i]]);
  }
  return total;
}

function permutations(items: number[]): number[][] {
  if (items.length <= 1) return [items];
  return items.flatMap((item, i) =>
    permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [item, ...rest]),
  );
}

const BRUTE_FORCE_LIMIT = 8;

/**
 * Shortest open path visiting every point once (no return trip).
 * With `fixedStart`, the path must begin at points[0] (e.g. the user's location).
 * Exact for small inputs; nearest-neighbour + 2-opt beyond that.
 * Returns indices into `points`.
 */
export function shortestPath(points: LatLng[], fixedStart: boolean): number[] {
  const all = points.map((_, i) => i);
  if (points.length <= 2) return all;

  const free = fixedStart ? all.slice(1) : all;
  const prefix = fixedStart ? [0] : [];

  if (free.length <= BRUTE_FORCE_LIMIT) {
    let best = all;
    let bestLen = Infinity;
    for (const perm of permutations(free)) {
      const order = [...prefix, ...perm];
      const len = pathLength(points, order);
      if (len < bestLen) {
        bestLen = len;
        best = order;
      }
    }
    return best;
  }

  // Nearest neighbour from the start, then 2-opt improvement.
  const order = [fixedStart ? 0 : free[0]];
  const remaining = new Set(all.filter((i) => i !== order[0]));
  while (remaining.size > 0) {
    const last = points[order[order.length - 1]];
    let next = -1;
    let nextDist = Infinity;
    for (const i of remaining) {
      const d = distanceKm(last, points[i]);
      if (d < nextDist) {
        nextDist = d;
        next = i;
      }
    }
    order.push(next);
    remaining.delete(next);
  }

  const first = fixedStart ? 1 : 0;
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = first; i < order.length - 1; i++) {
      for (let j = i + 1; j < order.length; j++) {
        const candidate = [
          ...order.slice(0, i),
          ...order.slice(i, j + 1).reverse(),
          ...order.slice(j + 1),
        ];
        if (pathLength(points, candidate) + 1e-9 < pathLength(points, order)) {
          order.splice(0, order.length, ...candidate);
          improved = true;
        }
      }
    }
  }
  return order;
}

export function totalKm(points: LatLng[]) {
  return pathLength(points, points.map((_, i) => i));
}
