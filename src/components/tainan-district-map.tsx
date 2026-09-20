"use client";

import Link from "next/link";
import { useState } from "react";

type Zone = "urban" | "north" | "coast" | "hills";

type District = {
  name: string;
  tag: string;
  zone: Zone;
  path: string;
  labelX: number;
  labelY: number;
  href?: string;
};

const zoneStyles: Record<
  Zone,
  { fill: string; stroke: string; text: string; dot: string; label: string }
> = {
  urban: {
    fill: "fill-accent/20 hover:fill-accent/35",
    stroke: "stroke-accent/60",
    text: "fill-accent",
    dot: "bg-accent",
    label: "都會生活圈",
  },
  north: {
    fill: "fill-amber-500/20 hover:fill-amber-500/35",
    stroke: "stroke-amber-400/50",
    text: "fill-amber-200",
    dot: "bg-amber-400",
    label: "平原鄉鎮",
  },
  coast: {
    fill: "fill-sky-500/20 hover:fill-sky-500/35",
    stroke: "stroke-sky-400/50",
    text: "fill-sky-200",
    dot: "bg-sky-400",
    label: "濱海漁鹽",
  },
  hills: {
    fill: "fill-emerald-500/20 hover:fill-emerald-500/35",
    stroke: "stroke-emerald-400/50",
    text: "fill-emerald-200",
    dot: "bg-emerald-400",
    label: "淺山丘陵",
  },
};

// Outer silhouette, hand-traced from a reference district map (approximate).
const boundaryPath =
  "M 260,10 L 430,15 L 485,105 L 585,185 L 595,275 L 525,345 L 400,400 L 350,460 L 255,505 L 145,495 L 35,440 L 10,290 L 35,160 L 55,95 L 110,105 L 200,60 Z";

// Each shape is a Voronoi cell (seeded near the district's real relative
// position) clipped to the outer silhouette above — not a survey-accurate
// boundary, but a recognisable, tileable map of all 37 districts.
const districts: District[] = [
  { name: "白河", tag: "蓮花故鄉．關子嶺溫泉", zone: "north", path: "M 379.6,51.3 L 381.4,13.6 L 430.0,15.0 L 466.9,75.4 L 407.2,84.0 Z", labelX: 413, labelY: 47.9 },
  { name: "後壁", tag: "稻米之鄉．無米樂社區", zone: "north", path: "M 256.6,12.9 L 260.0,10.0 L 381.4,13.6 L 379.6,51.3 L 318.3,87.0 Z", labelX: 319.2, labelY: 34.9 },
  { name: "新營", tag: "台南舊縣治．糖廠文化", zone: "north", path: "M 318.3,87.0 L 379.6,51.3 L 407.2,84.0 L 397.5,132.5 L 315.3,116.1 Z", labelX: 363.6, labelY: 94.2 },
  { name: "鹽水", tag: "月津港燈節．蜂炮小鎮", zone: "north", path: "M 256.6,12.9 L 318.3,87.0 L 315.3,116.1 L 298.4,140.0 L 235.7,140.0 L 194.9,62.6 L 200.0,60.0 Z", labelX: 259.9, labelY: 88.4 },
  { name: "東山", tag: "東山咖啡．龍眼產地", zone: "hills", path: "M 438.6,188.9 L 409.4,161.5 L 397.5,132.5 L 407.2,84.0 L 466.9,75.4 L 485.0,105.0 L 530.1,141.1 Z", labelX: 447.8, labelY: 126.9 },
  { name: "柳營", tag: "酪農重鎮．牧場鮮乳", zone: "north", path: "M 318.1,181.8 L 298.4,140.0 L 315.3,116.1 L 397.5,132.5 L 409.4,161.5 Z", labelX: 347.7, labelY: 146.4 },
  { name: "學甲", tag: "虱目魚故鄉．慈濟宮", zone: "coast", path: "M 235.7,140.0 L 221.8,166.4 L 200.9,179.4 L 141.4,170.9 L 124.9,146.0 L 140.5,89.8 L 194.9,62.6 Z", labelX: 180, labelY: 136.4 },
  { name: "六甲", tag: "隆田鐵道．林鳳營", zone: "north", path: "M 318.1,181.8 L 409.4,161.5 L 438.6,188.9 L 437.6,192.7 L 397.5,230.0 L 317.6,190.1 Z", labelX: 386.5, labelY: 190.8 },
  { name: "官田", tag: "菱角之鄉．烏山頭水庫", zone: "north", path: "M 307.9,245.0 L 296.0,239.5 L 317.6,190.1 L 397.5,230.0 L 390.0,245.0 Z", labelX: 341.8, labelY: 229.9 },
  { name: "楠西", tag: "梅嶺賞梅．曾文水庫", zone: "hills", path: "M 437.6,192.7 L 438.6,188.9 L 530.1,141.1 L 585.0,185.0 L 595.0,275.0 L 579.4,290.6 L 471.0,259.6 Z", labelX: 519.6, labelY: 219 },
  { name: "北門", tag: "鹽田風光．水晶教堂", zone: "coast", path: "M 124.9,146.0 L 34.2,164.2 L 35.0,160.0 L 55.0,95.0 L 110.0,105.0 L 140.5,89.8 Z", labelX: 83.3, labelY: 126.7 },
  { name: "將軍", tag: "漁港風情", zone: "coast", path: "M 124.9,146.0 L 141.4,170.9 L 119.2,243.3 L 27.8,197.6 L 34.2,164.2 Z", labelX: 89.5, labelY: 184.4 },
  { name: "佳里", tag: "金唐殿．老街市集", zone: "north", path: "M 200.9,179.4 L 192.7,228.9 L 122.5,250.0 L 119.2,243.3 L 141.4,170.9 Z", labelX: 155.3, labelY: 214.5 },
  { name: "下營", tag: "火雞肉飯故鄉", zone: "north", path: "M 235.7,140.0 L 298.4,140.0 L 318.1,181.8 L 317.6,190.1 L 296.0,239.5 L 282.6,246.2 L 272.9,243.2 L 221.8,166.4 Z", labelX: 280.4, labelY: 193.4 },
  { name: "麻豆", tag: "文旦柚之鄉", zone: "north", path: "M 200.9,179.4 L 221.8,166.4 L 272.9,243.2 L 216.8,256.1 L 192.7,228.9 Z", labelX: 221, labelY: 214.8 },
  { name: "大內", tag: "走馬瀨農場", zone: "hills", path: "M 307.9,245.0 L 390.0,245.0 L 390.0,292.5 L 347.5,292.5 Z", labelX: 358.9, labelY: 268.8 },
  { name: "玉井", tag: "芒果之鄉", zone: "hills", path: "M 400.6,307.9 L 390.0,292.5 L 390.0,245.0 L 397.5,230.0 L 437.6,192.7 L 471.0,259.6 L 425.1,325.2 Z", labelX: 416, labelY: 264.7 },
  { name: "七股", tag: "鹽山．黑面琵鷺保護區", zone: "coast", path: "M 119.2,243.3 L 122.5,250.0 L 122.5,277.5 L 122.0,279.1 L 16.4,328.4 L 10.0,290.0 L 27.8,197.6 Z", labelX: 77.2, labelY: 266.6 },
  { name: "西港", tag: "刈香文化．西瓜產地", zone: "coast", path: "M 192.7,228.9 L 216.8,256.1 L 207.9,277.5 L 122.5,277.5 L 122.5,250.0 Z", labelX: 172.5, labelY: 258 },
  { name: "安定", tag: "蘇厝真武殿", zone: "north", path: "M 207.9,277.5 L 211.5,298.8 L 195.4,334.1 L 170.1,342.0 L 152.6,340.1 L 122.0,279.1 L 122.5,277.5 Z", labelX: 168.9, labelY: 307 },
  { name: "善化", tag: "胡蘿蔔之鄉．牛墟", zone: "north", path: "M 207.9,277.5 L 216.8,256.1 L 272.9,243.2 L 282.6,246.2 L 279.0,304.0 L 271.0,307.3 L 211.5,298.8 Z", labelX: 248.8, labelY: 276.1 },
  { name: "山上", tag: "尪祖廟．山區小鎮", zone: "hills", path: "M 279.0,304.0 L 282.6,246.2 L 296.0,239.5 L 307.9,245.0 L 347.5,292.5 L 307.5,332.5 Z", labelX: 303.4, labelY: 276.6 },
  { name: "南化", tag: "龍眼．南化水庫", zone: "hills", path: "M 425.1,325.2 L 471.0,259.6 L 579.4,290.6 L 525.0,345.0 L 449.2,378.3 Z", labelX: 490, labelY: 319.7 },
  { name: "安南", tag: "四草綠色隧道．台江國家公園", zone: "coast", path: "M 122.0,279.1 L 152.6,340.1 L 140.3,355.7 L 110.9,378.4 L 19.3,345.6 L 16.4,328.4 Z", labelX: 93.6, labelY: 337.9 },
  { name: "新市", tag: "新市老街．南科園區", zone: "north", path: "M 195.4,334.1 L 211.5,298.8 L 271.0,307.3 L 232.0,354.1 Z", labelX: 227.5, labelY: 323.6 },
  { name: "新化", tag: "新化老街．虎頭埤", zone: "hills", path: "M 232.0,354.1 L 271.0,307.3 L 279.0,304.0 L 307.5,332.5 L 316.2,362.1 L 240.3,370.5 Z", labelX: 274.3, labelY: 338.4 },
  { name: "左鎮", tag: "化石秘境．草山月世界", zone: "hills", path: "M 316.2,362.1 L 307.5,332.5 L 347.5,292.5 L 390.0,292.5 L 400.6,307.9 L 317.4,363.4 Z", labelX: 346.5, labelY: 325.2 },
  { name: "龍崎", tag: "竹編工藝．牛埔月世界", zone: "urban", path: "M 400.6,307.9 L 425.1,325.2 L 449.2,378.3 L 400.0,400.0 L 354.1,455.1 L 317.4,363.4 Z", labelX: 391.1, labelY: 371.7 },
  { name: "安平區", tag: "港邊老城．安平古堡．漁人碼頭", zone: "urban", path: "M 110.9,378.4 L 116.2,458.8 L 112.3,478.6 L 35.0,440.0 L 19.3,345.6 Z", labelX: 78.7, labelY: 420.3, href: "/anping" },
  { name: "北區", tag: "開元寺．在地生活圈", zone: "urban", path: "M 152.6,340.1 L 170.1,342.0 L 188.9,385.7 L 172.5,407.5 L 166.7,408.3 L 140.3,355.7 Z", labelX: 165.2, labelY: 373.2 },
  { name: "中西區", tag: "孔廟．林百貨．老城核心", zone: "urban", path: "M 110.9,378.4 L 140.3,355.7 L 166.7,408.3 L 116.3,458.7 Z", labelX: 133.5, labelY: 400.3 },
  { name: "東區", tag: "成功大學．文教商圈", zone: "urban", path: "M 188.9,385.7 L 213.6,398.0 L 212.5,407.5 L 193.1,423.0 L 172.5,407.5 Z", labelX: 196.1, labelY: 404.3 },
  { name: "永康區", tag: "奇美博物館．復興夜市", zone: "urban", path: "M 195.4,334.1 L 232.0,354.1 L 240.3,370.5 L 238.9,376.3 L 213.6,398.0 L 188.9,385.7 L 170.1,342.0 Z", labelX: 211.3, labelY: 365.8 },
  { name: "關廟區", tag: "關廟麵．鳳梨產地", zone: "urban", path: "M 238.9,376.3 L 240.3,370.5 L 316.2,362.1 L 317.4,363.4 L 354.1,455.1 L 350.0,460.0 L 300.3,483.6 Z", labelX: 302.4, labelY: 410.1 },
  { name: "歸仁區", tag: "高鐵台南站", zone: "urban", path: "M 213.6,398.0 L 238.9,376.3 L 300.3,483.6 L 280.7,492.8 L 212.5,407.5 Z", labelX: 249.2, labelY: 431.6 },
  { name: "南區", tag: "喜樹灣裡．彩繪聚落", zone: "urban", path: "M 166.7,408.3 L 172.5,407.5 L 193.1,423.0 L 182.4,498.4 L 145.0,495.0 L 112.3,478.6 L 116.2,458.7 Z", labelX: 155.5, labelY: 452.8 },
  { name: "仁德區", tag: "十鼓文化村", zone: "urban", path: "M 193.1,423.0 L 212.5,407.5 L 280.7,492.8 L 255.0,505.0 L 182.4,498.4 Z", labelX: 224.8, labelY: 465.3 },
];

export function TainanDistrictMap() {
  const [selected, setSelected] = useState<District | null>(null);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {(Object.keys(zoneStyles) as Zone[]).map((zone) => (
          <span
            key={zone}
            className="inline-flex items-center gap-1.5 text-xs text-muted"
          >
            <span className={`h-2 w-2 rounded-full ${zoneStyles[zone].dot}`} />
            {zoneStyles[zone].label}
          </span>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <svg viewBox="-15 -15 630 545" className="w-full">
          <path
            d={boundaryPath}
            className="fill-none stroke-border"
            strokeWidth={1.5}
          />
          {districts.map((d) => (
            <path
              key={d.name}
              d={d.path}
              onClick={() => setSelected(d)}
              className={`cursor-pointer transition-colors ${zoneStyles[d.zone].fill} ${
                selected?.name === d.name
                  ? "stroke-foreground"
                  : zoneStyles[d.zone].stroke
              }`}
              strokeWidth={selected?.name === d.name ? 2 : 1}
            >
              <title>{d.name}</title>
            </path>
          ))}
          {districts.map((d) => (
            <text
              key={d.name}
              x={d.labelX}
              y={d.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`pointer-events-none select-none font-medium ${zoneStyles[d.zone].text}`}
              style={{
                fontSize: 11,
                paintOrder: "stroke",
                stroke: "#0c0a08",
                strokeWidth: 2.5,
              }}
            >
              {d.name}
            </text>
          ))}
        </svg>
      </div>

      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-border bg-background-elevated p-6 text-center">
        {selected ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-xs">
              <span
                className={`h-1.5 w-1.5 rounded-full ${zoneStyles[selected.zone].dot}`}
              />
              <span className="text-muted">
                {zoneStyles[selected.zone].label}
              </span>
            </span>
            <h3 className="mt-2 font-[family-name:var(--font-serif-tc)] text-xl text-foreground">
              {selected.name}
            </h3>
            <p className="mt-2 text-sm text-muted">{selected.tag}</p>
            {selected.href ? (
              <Link
                href={selected.href}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-6 py-2.5 text-sm text-accent transition-colors hover:bg-accent/20"
              >
                前往安平專頁
                <span aria-hidden>→</span>
              </Link>
            ) : (
              <p className="mt-5 text-xs text-muted/70">
                這一區的景點介紹陸續更新中，敬請期待。
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted">點地圖上的一區，看看那裡有什麼特色</p>
        )}
      </div>
    </div>
  );
}
