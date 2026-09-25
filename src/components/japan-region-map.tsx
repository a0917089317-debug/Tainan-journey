"use client";

import { useState } from "react";
import mapData from "@/components/japan-prefectures.json";

type Zone = "north" | "central" | "kansai" | "south";

type Prefecture = {
  id: number;
  nameEn: string;
  nameJa: string;
  zone: Zone;
  d: string;
  labelX: number;
  labelY: number;
};

const zoneStyles: Record<
  Zone,
  { fill: string; stroke: string; text: string; dot: string; label: string }
> = {
  north: {
    fill: "fill-sky-500/25 hover:fill-sky-500/40",
    stroke: "stroke-sky-400/50",
    text: "fill-sky-200",
    dot: "bg-sky-400",
    label: "北海道．東北",
  },
  central: {
    fill: "fill-accent/25 hover:fill-accent/40",
    stroke: "stroke-accent/60",
    text: "fill-accent",
    dot: "bg-accent",
    label: "關東．中部",
  },
  kansai: {
    fill: "fill-amber-500/25 hover:fill-amber-500/40",
    stroke: "stroke-amber-400/50",
    text: "fill-amber-200",
    dot: "bg-amber-400",
    label: "關西．中國．四國",
  },
  south: {
    fill: "fill-emerald-500/25 hover:fill-emerald-500/40",
    stroke: "stroke-emerald-400/50",
    text: "fill-emerald-200",
    dot: "bg-emerald-400",
    label: "九州．沖繩",
  },
};

// 9 大傳統地方（依 JIS 都道府県編號分組），用來在資訊卡顯示所屬地方與簡介
const regionInfo: { range: [number, number]; name: string; tag: string }[] = [
  { range: [1, 1], name: "北海道", tag: "雪祭與滑雪．夏天薰衣草花海" },
  { range: [2, 7], name: "東北", tag: "溫泉祕境．蘋果與雪景" },
  { range: [8, 14], name: "關東", tag: "東京．橫濱．都會與購物天堂" },
  { range: [15, 23], name: "中部", tag: "合掌村．立山黑部．日本阿爾卑斯" },
  { range: [24, 30], name: "關西", tag: "京都古寺．大阪美食．奈良小鹿" },
  { range: [31, 35], name: "中國", tag: "廣島．嚴島神社．岡山桃太郎" },
  { range: [36, 39], name: "四國", tag: "遍路文化．祖谷溪．道後溫泉" },
  { range: [40, 46], name: "九州", tag: "福岡拉麵．別府溫泉．屋台文化" },
  { range: [47, 47], name: "沖繩", tag: "南國海島．浮潛與水族館" },
];

function getRegionInfo(id: number) {
  return (
    regionInfo.find(({ range: [min, max] }) => id >= min && id <= max) ??
    regionInfo[0]
  );
}

// 47 都道府県的繁體中文名稱（原始資料為日文漢字，部分新字體與繁體寫法不同，例如 県→縣、静→靜、広→廣、徳→德、児→兒、縄→繩）
const TRADITIONAL_NAME: Record<number, string> = {
  1: "北海道",
  2: "青森縣",
  3: "岩手縣",
  4: "宮城縣",
  5: "秋田縣",
  6: "山形縣",
  7: "福島縣",
  8: "茨城縣",
  9: "栃木縣",
  10: "群馬縣",
  11: "埼玉縣",
  12: "千葉縣",
  13: "東京都",
  14: "神奈川縣",
  15: "新潟縣",
  16: "富山縣",
  17: "石川縣",
  18: "福井縣",
  19: "山梨縣",
  20: "長野縣",
  21: "岐阜縣",
  22: "靜岡縣",
  23: "愛知縣",
  24: "三重縣",
  25: "滋賀縣",
  26: "京都府",
  27: "大阪府",
  28: "兵庫縣",
  29: "奈良縣",
  30: "和歌山縣",
  31: "鳥取縣",
  32: "島根縣",
  33: "岡山縣",
  34: "廣島縣",
  35: "山口縣",
  36: "德島縣",
  37: "香川縣",
  38: "愛媛縣",
  39: "高知縣",
  40: "福岡縣",
  41: "佐賀縣",
  42: "長崎縣",
  43: "熊本縣",
  44: "大分縣",
  45: "宮崎縣",
  46: "鹿兒島縣",
  47: "沖繩縣",
};

const prefectures = mapData.features as Prefecture[];
const { width, height } = mapData;

export function JapanRegionMap() {
  const [selected, setSelected] = useState<Prefecture | null>(null);
  const selectedRegion = selected ? getRegionInfo(selected.id) : null;

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
        <svg viewBox={`-6 -6 ${width + 12} ${height + 12}`} className="w-full">
          {prefectures.map((p) => (
            <path
              key={p.id}
              d={p.d}
              onClick={() => setSelected(p)}
              className={`cursor-pointer transition-colors ${zoneStyles[p.zone].fill} ${
                selected?.id === p.id
                  ? "stroke-foreground"
                  : zoneStyles[p.zone].stroke
              }`}
              strokeWidth={selected?.id === p.id ? 1.6 : 0.6}
              strokeLinejoin="round"
            >
              <title>{TRADITIONAL_NAME[p.id]}</title>
            </path>
          ))}
        </svg>
      </div>

      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-white/15 bg-white/[0.06] p-6 text-center backdrop-blur-xl">
        {selected && selectedRegion ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-xs">
              <span
                className={`h-1.5 w-1.5 rounded-full ${zoneStyles[selected.zone].dot}`}
              />
              <span className="text-muted">{selectedRegion.name}地方</span>
            </span>
            <h3 className="mt-2 font-[family-name:var(--font-serif-tc)] text-xl text-foreground">
              {TRADITIONAL_NAME[selected.id]}
            </h3>
            <p className="mt-2 text-sm text-muted">{selectedRegion.tag}</p>
          </>
        ) : (
          <p className="text-sm text-muted">
            點地圖上的都道府縣，看看屬於哪個地方、有什麼特色
          </p>
        )}
      </div>
    </div>
  );
}
