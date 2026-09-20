"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { latLngToContainerPercent, type LatLng } from "@/lib/geo";

type Target = {
  id: string;
  name: string;
  tag: string;
  position: LatLng;
  desc: string;
  address: string;
  image?: { src: string; alt: string };
};

type Hit = {
  key: string;
  target: Target;
  jitterX: number;
  jitterY: number;
};

// Centroid of the 9 target coordinates below, zoomed out enough that the
// 億載金城 outlier still fits on a small mobile map without clamping.
const MAP_CENTER: LatLng = { lat: 22.9982, lng: 120.1611 };
const MAP_ZOOM = 14;

// Coordinates geocoded against OpenStreetMap/Nominatim POI + address lookups
// (cross-checked with published attraction coordinates), not eyeballed.
const targets: Target[] = [
  {
    id: "fort",
    name: "安平古堡",
    tag: "歷史古蹟",
    position: { lat: 23.0016, lng: 120.1606 },
    desc: "台灣最早的城堡遺跡，荷蘭時期的熱蘭遮城所在地，登上瞭望台可以俯瞰安平街區。",
    address: "台南市安平區國勝路82號",
  },
  {
    id: "old-street",
    name: "延平街．安平老街",
    tag: "老街散步",
    position: { lat: 23.0007, lng: 120.1624 },
    desc: "台灣第一條街，蜿蜒巷弄裡藏著老屋、小吃與伴手禮店，隨走隨逛不用趕行程。",
    address: "台南市安平區延平街",
  },
  {
    id: "tree-house",
    name: "安平樹屋．德記洋行",
    tag: "老樹奇景",
    position: { lat: 23.004, lng: 120.1597 },
    desc: "百年榕樹盤根錯節爬滿整棟老倉庫，走在樹屋棧道間光影很魔幻，一個人拍照也很出片。",
    address: "台南市安平區古堡街104號",
    image: { src: "/images/安平樹屋.jpg", alt: "安平樹屋老榕樹盤根錯節景觀" },
  },
  {
    id: "fort-jin",
    name: "億載金城",
    tag: "海防遺跡",
    position: { lat: 22.9876, lng: 120.1595 },
    desc: "台灣第一座西式砲台，護城河環繞、草坪開闊，傍晚時分特別寧靜好散步。",
    address: "台南市安平區光州路3號",
  },
  {
    id: "canal",
    name: "安平運河．夕游出張所",
    tag: "運河夕陽",
    position: { lat: 23.0025, lng: 120.1563 },
    desc: "日治時期的鹽務辦公室改建的甜點店，運河堤岸是安平看夕陽的經典角度。",
    address: "台南市安平區古堡街196號",
  },
  {
    id: "temple",
    name: "開臺天后宮",
    tag: "信仰中心",
    position: { lat: 23.0006, lng: 120.1607 },
    desc: "全台開基媽祖廟之一，香火鼎盛，廟埕周邊也有不少在地小吃可以順路醫肚子。",
    address: "台南市安平區國勝路33號",
  },
  {
    id: "whale",
    name: "大魚的祝福",
    tag: "地標",
    position: { lat: 22.9957, lng: 120.1634 },
    desc: "矗立在安平漁人碼頭岸邊的巨型鯨魚裝置藝術，藍天大海為背景相當壯觀，是近年來安平新興的熱門打卡地標，白天光線好時拍起來特別出片。",
    address: "台南市安平區安平漁人碼頭",
    image: { src: "/images/大魚的祝福.jpg", alt: "安平漁人碼頭大魚的祝福鯨魚裝置藝術" },
  },
  {
    id: "wharf",
    name: "安平漁人碼頭夜景",
    tag: "地標",
    position: { lat: 22.9967, lng: 120.1636 },
    desc: "入夜後碼頭的燈光陸續點亮，海面倒映著燈影，海風徐徐吹來，是結束一天行程後很適合一個人靜靜散步收尾的地方。",
    address: "台南市安平區安平漁人碼頭",
    image: {
      src: "/images/安平漁人碼頭夜晚點燈照片.jpg",
      alt: "安平漁人碼頭夜晚點燈景色",
    },
  },
  {
    id: "hotpot",
    name: "牛園火鍋 安平店",
    tag: "美食",
    position: { lat: 22.9944, lng: 120.1636 },
    desc: "開在安億路上，鄰近安平漁人碼頭，中式庭園風格的用餐空間，紅燈籠與梅花裝飾很有氛圍。肉盤、海鮮拼盤新鮮豐盛，湯頭選擇多，一個人也能自在吃火鍋。",
    address: "台南市安平區安億路．鄰近安平漁人碼頭",
    image: {
      src: "/images/牛園火鍋室內用餐環境.webp",
      alt: "牛園火鍋安平店室內用餐環境",
    },
  },
];

const presets = [1, 3, 5];
const MAX_DARTS = 10;

export function AnpingDartGame() {
  const [dartCount, setDartCount] = useState(3);
  const [hits, setHits] = useState<Hit[]>([]);
  const [throwing, setThrowing] = useState(false);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setMapSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const throwDarts = () => {
    if (throwing) return;
    setThrowing(true);

    const newHits: Hit[] = Array.from({ length: dartCount }, (_, i) => {
      const target = targets[Math.floor(Math.random() * targets.length)];
      return {
        key: `${Date.now()}-${i}`,
        target,
        jitterX: ((i % 3) - 1) * 1.5,
        jitterY: ((Math.floor(i / 3) % 3) - 1) * 1.5,
      };
    });

    setHits(newHits);
    window.setTimeout(() => setThrowing(false), 500 + dartCount * 120);
  };

  const grouped = hits.reduce<
    Record<string, { target: Target; darts: number[] }>
  >((acc, hit, i) => {
    const existing = acc[hit.target.id];
    if (existing) existing.darts.push(i + 1);
    else acc[hit.target.id] = { target: hit.target, darts: [i + 1] };
    return acc;
  }, {});

  const positioned =
    mapSize.width > 0 && mapSize.height > 0
      ? targets.map((t) => ({
          target: t,
          ...latLngToContainerPercent(
            t.position,
            MAP_CENTER,
            MAP_ZOOM,
            mapSize.width,
            mapSize.height,
          ),
        }))
      : [];

  const percentByTargetId = new Map(
    positioned.map((p) => [p.target.id, { left: p.left, top: p.top }]),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm text-muted">飛鏢數量</span>
        <div className="flex gap-2">
          {presets.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setDartCount(n)}
              className={`h-9 w-9 rounded-full border text-sm transition-colors ${
                dartCount === n
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-border text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border px-1">
          <button
            type="button"
            aria-label="減少飛鏢數量"
            onClick={() => setDartCount((c) => Math.max(1, c - 1))}
            className="flex h-8 w-8 items-center justify-center text-muted hover:text-foreground"
          >
            −
          </button>
          <span className="w-6 text-center text-sm text-foreground">
            {dartCount}
          </span>
          <button
            type="button"
            aria-label="增加飛鏢數量"
            onClick={() => setDartCount((c) => Math.min(MAX_DARTS, c + 1))}
            className="flex h-8 w-8 items-center justify-center text-muted hover:text-foreground"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={throwDarts}
          disabled={throwing}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          🎯 擲飛鏢
        </button>
      </div>

      <div
        ref={mapRef}
        className="relative mx-auto mt-10 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-background-elevated sm:aspect-[16/9]"
      >
        {/*
          pointer-events-none is load-bearing: our pins are positioned by
          converting lat/lng to a percentage of this container assuming a
          FIXED map center/zoom. If visitors could drag or zoom the embed,
          the underlying map would shift under our overlay and every pin
          would drift off its real location. Locking interaction keeps the
          projection in latLngToContainerPercent valid at all times.
        */}
        <iframe
          title="安平地圖"
          src={`https://maps.google.com/maps?ll=${MAP_CENTER.lat},${MAP_CENTER.lng}&z=${MAP_ZOOM}&output=embed`}
          className="pointer-events-none absolute inset-0 h-full w-full border-0"
          style={{
            filter:
              "invert(92%) hue-rotate(180deg) brightness(95%) contrast(90%)",
          }}
          loading="lazy"
          tabIndex={-1}
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="pointer-events-none absolute inset-0 bg-background/10" />

        {positioned.map(({ target: t, left, top }) => {
          const isHit = hits.some((h) => h.target.id === t.id);
          return (
            <div
              key={t.id}
              style={{ left: `${left}%`, top: `${top}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="flex flex-col items-center">
                <span
                  className={`block h-2 w-2 rounded-full border transition-all duration-500 ${
                    isHit
                      ? "scale-125 border-accent bg-accent"
                      : "border-muted/50 bg-background"
                  }`}
                />
                <span
                  className={`mt-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] transition-colors ${
                    isHit
                      ? "bg-accent/20 text-accent"
                      : "bg-background/60 text-muted"
                  }`}
                >
                  {t.name}
                </span>
              </div>
            </div>
          );
        })}

        {hits.map((hit, i) => {
          const pos = percentByTargetId.get(hit.target.id);
          if (!pos) return null;
          return (
            <span
              key={hit.key}
              title={`第 ${i + 1} 支飛鏢：${hit.target.name}`}
              style={{
                left: `${pos.left + hit.jitterX}%`,
                top: `${pos.top + hit.jitterY}%`,
                animationDelay: `${i * 130}ms`,
              }}
              className="dart-land pointer-events-none absolute flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-accent text-[10px] font-bold text-background shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
            >
              {i + 1}
            </span>
          );
        })}

        {hits.length === 0 && (
          <p className="absolute inset-x-0 bottom-4 text-center text-xs text-muted/70">
            按下「擲飛鏢」，讓緣分決定接下來要去哪裡逛逛
          </p>
        )}
      </div>

      {hits.length > 0 && (
        <div className="mx-auto mt-8 max-w-2xl">
          <p className="text-center text-xs tracking-[0.3em] text-accent">
            本輪命中．點景點看詳細介紹
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {Object.values(grouped).map(({ target, darts }) => (
              <button
                key={target.id}
                type="button"
                onClick={() => setSelectedTarget(target)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background-elevated px-4 py-2 text-sm transition-colors hover:border-accent/50 hover:bg-accent/10"
              >
                <span className="flex -space-x-1">
                  {darts.map((n) => (
                    <span
                      key={n}
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-background ring-1 ring-background-elevated"
                    >
                      {n}
                    </span>
                  ))}
                </span>
                <span className="text-xs text-muted">{target.tag}</span>
                {target.name}
                <span aria-hidden className="text-muted">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 px-6 backdrop-blur-sm"
          onClick={() => setSelectedTarget(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-background-elevated shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedTarget.image && (
              <div className="relative aspect-[4/3]">
                <Image
                  src={selectedTarget.image.src}
                  alt={selectedTarget.image.alt}
                  fill
                  sizes="(min-width: 640px) 448px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <span className="text-xs tracking-wide text-accent">
                {selectedTarget.tag}
              </span>
              <h3 className="mt-2 font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">
                {selectedTarget.name}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                {selectedTarget.desc}
              </p>
              <p className="mt-4 text-xs text-muted/70">
                📍 {selectedTarget.address}
              </p>
              <div className="mt-4">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border">
                  <iframe
                    title={`${selectedTarget.name}位置圖`}
                    src={`https://maps.google.com/maps?q=${
                      selectedTarget.position.lat
                    },${selectedTarget.position.lng}(${encodeURIComponent(
                      selectedTarget.name,
                    )})&z=17&output=embed`}
                    className="absolute inset-0 h-full w-full border-0"
                    style={{
                      filter:
                        "invert(92%) hue-rotate(180deg) brightness(95%) contrast(90%)",
                    }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedTarget.position.lat},${selectedTarget.position.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  在 Google 地圖中開啟 ↗
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTarget(null)}
                className="mt-6 w-full rounded-full border border-border py-2.5 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
