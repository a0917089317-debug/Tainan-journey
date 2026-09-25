"use client";

import { useState, useSyncExternalStore } from "react";
import { ApiKeySettings } from "@/components/api-key-settings";
import { getOpenAIKey, OPENAI_KEY_HEADER, subscribeOpenAIKey } from "@/lib/openai-key";
import {
  countryLabels,
  destinations,
  lodgings,
  MAX_PEOPLE,
  transports,
  type Country,
  type LodgingId,
  type RegionHighlights,
  type TransportId,
} from "@/lib/journey-options";
import { RegionHighlightsMenu } from "@/components/region-highlights";

const CARD = "rounded-2xl border border-border bg-background-elevated p-6";

const THSR_URL =
  "https://www.thsrc.com.tw/ArticleContent/a3b630bb-1066-4352-a1ef-58c7b4e8ef7c";
const TRA_BASE = "https://tip.railway.gov.tw/tra-tip-web/tip/tip001";

const railLinks = [
  { label: "高鐵時刻表", href: THSR_URL, tone: "red" as const },
  { label: "火車時刻表", href: `${TRA_BASE}/tip112/gobytime` },
  { label: "高鐵票價", href: THSR_URL, tone: "red" as const },
  { label: "火車票價", href: `${TRA_BASE}/tip114/query` },
];

const bikeLinks = [
  { label: "YouBike 站點", href: "https://www.youbike.com.tw/region/main/stations/" },
];

const rentLinks = [
  {
    label: "iRent 機車據點",
    href: "https://www.irentcar.com.tw/UPLOAD/event/111event/2598/index.html",
    tone: "sky" as const,
  },
];

const RAIL_PATTERN = /火車|高鐵|台鐵|臺鐵/;
const RENT_PATTERN = /(租|借)[^，。\s]{0,3}(機車|汽車|車)|機車/;
const BIKE_PATTERN =
  /(租|借)[^，。\s]{0,3}(機車|汽車|車)|機車|大眾運輸|公車|客運|捷運|YouBike|UBike|公共自行車/i;

const LINK_TONES = {
  accent: "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20",
  green: "border-green-500/50 bg-green-500/15 text-green-400 hover:bg-green-500/25",
  red: "border-red-500/50 bg-red-500/15 text-red-400 hover:bg-red-500/25",
  sky: "border-sky-500/50 bg-sky-500/15 text-sky-400 hover:bg-sky-500/25",
};

type LinkTone = keyof typeof LINK_TONES;

function ShortcutLinks({
  links,
  tone = "accent",
  note,
}: {
  links: { label: string; href: string; tone?: LinkTone }[];
  tone?: LinkTone;
  note?: string;
}) {
  return (
    <span className="my-1 flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-full border px-3 py-0.5 text-xs transition-colors ${LINK_TONES[link.tone ?? tone]}`}
        >
          {link.label} ↗
        </a>
      ))}
      {note && <span className="text-xs text-muted">{note}</span>}
    </span>
  );
}

function optionClass(active: boolean) {
  return `cursor-pointer rounded-xl border px-4 py-3 text-sm transition-colors ${
    active
      ? "border-accent bg-accent/15 text-foreground"
      : "border-border text-muted hover:border-accent-soft hover:text-foreground"
  }`;
}

export function JourneyPlanner() {
  const [country, setCountry] = useState<Country>("taiwan");
  const [selected, setSelected] = useState<string[]>([]);
  const [transport, setTransport] = useState<TransportId | null>(null);
  const [lodging, setLodging] = useState<LodgingId | null>(null);
  const [people, setPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [resultCountry, setResultCountry] = useState<Country>("taiwan");
  const [highlights, setHighlights] = useState<RegionHighlights[]>([]);
  const [resultTransport, setResultTransport] = useState<TransportId | null>(null);

  const apiKey = useSyncExternalStore(subscribeOpenAIKey, getOpenAIKey, () => "");

  const canSubmit =
    apiKey !== "" &&
    selected.length > 0 &&
    transport !== null &&
    lodging !== null &&
    !loading;

  function switchCountry(next: Country) {
    setCountry(next);
    setSelected([]);
  }

  function toggleDestination(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setAnalysis("");
    setHighlights([]);
    try {
      const res = await fetch("/api/journey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [OPENAI_KEY_HEADER]: apiKey,
        },
        body: JSON.stringify({
          country,
          destinations: selected,
          transport,
          lodging,
          people,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "發生錯誤");
      setAnalysis(data.analysis);
      setHighlights(data.highlights ?? []);
      setResultTransport(transport);
      setResultCountry(country);
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <ApiKeySettings apiKey={apiKey} />
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
        <section className={CARD}>
          <h2 className="font-[family-name:var(--font-serif-tc)] text-xl">
            1. 要去的地方
          </h2>
          <div className="mt-4 flex gap-2">
            {(Object.keys(countryLabels) as Country[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => switchCountry(c)}
                className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                  country === c
                    ? "border-accent bg-accent text-background"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {countryLabels[c]}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {destinations[country].map((d) => {
              const active = selected.includes(d.name);
              return (
                <label key={d.name} className={optionClass(active)}>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleDestination(d.name)}
                    className="mr-2 accent-[var(--accent)]"
                  />
                  <span className="font-medium">{d.name}</span>
                  <span className="mt-1 block text-xs text-muted">{d.spots}</span>
                </label>
              );
            })}
          </div>
        </section>
  
        <section className={CARD}>
          <h2 className="font-[family-name:var(--font-serif-tc)] text-xl">
            2. 怎麼去
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {transports.map((t) => (
              <label key={t.id} className={optionClass(transport === t.id)}>
                <input
                  type="radio"
                  name="transport"
                  checked={transport === t.id}
                  onChange={() => setTransport(t.id)}
                  className="mr-2 accent-[var(--accent)]"
                />
                {t.label}
              </label>
            ))}
          </div>
        </section>
  
        <section className={CARD}>
          <h2 className="font-[family-name:var(--font-serif-tc)] text-xl">
            3. 住宿
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {lodgings.map((l) => (
              <label key={l.id} className={optionClass(lodging === l.id)}>
                <input
                  type="radio"
                  name="lodging"
                  checked={lodging === l.id}
                  onChange={() => setLodging(l.id)}
                  className="mr-2 accent-[var(--accent)]"
                />
                {l.label}
              </label>
            ))}
          </div>
          <label className="mt-5 flex items-center gap-3 text-sm text-muted">
            人數
            <select
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            >
              {Array.from({ length: MAX_PEOPLE }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} 人
                </option>
              ))}
            </select>
          </label>
        </section>
  
        <button
          type="submit"
          disabled={!canSubmit}
          className="self-start rounded-full bg-accent px-8 py-3 text-sm font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "AI 分析中…" : "開始分析"}
        </button>
        {!apiKey && (
          <p className="-mt-5 text-xs text-amber-300">
            請先在上方「API 設定」輸入你的 OpenAI API Key 才能開始分析
          </p>
        )}
  
        {error && (
          <p className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
  
        {highlights.length > 0 && resultTransport && (
          <RegionHighlightsMenu
            key={analysis}
            regions={highlights}
            transport={resultTransport}
            country={resultCountry}
          />
        )}
  
        {analysis && (
          <section className={CARD}>
            <h2 className="font-[family-name:var(--font-serif-tc)] text-xl text-accent">
              AI 分析結果
            </h2>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground">
              {analysis.split("\n").map((line, i) => (
                <div key={i}>
                  {line || " "}
                  {resultCountry === "taiwan" && RAIL_PATTERN.test(line) && (
                    <ShortcutLinks links={railLinks} />
                  )}
                  {resultCountry === "taiwan" && BIKE_PATTERN.test(line) && (
                    <ShortcutLinks links={bikeLinks} tone="green" />
                  )}
                  {resultCountry === "taiwan" && RENT_PATTERN.test(line) && (
                    <ShortcutLinks
                      links={rentLinks}
                      note="火車站附近尚有數家出租機車的店家可供參考"
                    />
                  )}
                  {resultCountry === "taiwan" && line.includes("機車") && (
                    <span className="mb-1 block text-xs text-amber-300">
                      （貼心提醒：記得攜帶個人證件／駕照／雨具）
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </form>
    </div>
  );
}
