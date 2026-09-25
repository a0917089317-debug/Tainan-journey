import type { Metadata } from "next";
import { ParallaxHeroImage } from "@/components/parallax-hero-image";
import { JapanRegionMap } from "@/components/japan-region-map";

export const metadata: Metadata = {
  title: "日本自由行入門 | 台南獨旅",
  description:
    "日本自由行新手指南：地區介紹、行前準備、交通與住宿建議，以及七日行程範例，獻給第一次規劃日本自由行的旅人。",
};

const GLASS_CARD =
  "rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]";

const regions = [
  {
    tag: "關東",
    title: "東京．橫濱",
    desc: "都會與傳統交錯，購物、動漫、美食一次滿足，交通網絡最完整，新手自由行首選。",
  },
  {
    tag: "關西",
    title: "大阪．京都．奈良",
    desc: "京都古寺神社、大阪庶民美食與奈良小鹿，三地鐵路串連方便，適合安排 5-7 天深度遊。",
  },
  {
    tag: "北海道",
    title: "札幌．函館．小樽",
    desc: "四季分明，夏天薰衣草、冬天雪祭與滑雪，腹地大建議自駕或搭配鐵路周遊券。",
  },
  {
    tag: "九州",
    title: "福岡．別府．由布院",
    desc: "溫泉大國，拉麵與屋台文化發源地，機票常比關東便宜，適合溫泉控。",
  },
  {
    tag: "沖繩",
    title: "那霸．石垣島",
    desc: "南國海島風情，浮潛、水族館與美式文化混搭，飛行時間短，適合排 3-4 天輕旅行。",
  },
  {
    tag: "中部",
    title: "名古屋．高山．立山黑部",
    desc: "合掌村、雪牆與日本阿爾卑斯山脈景觀，適合喜歡山岳與秘境風景的旅人。",
  },
];

const tips = [
  {
    title: "簽證與入境",
    desc: "台灣護照可免簽入境日本，停留 90 天內免簽證，建議行前用 Visit Japan Web 先線上填寫入境與海關申報資料。",
  },
  {
    title: "交通票券",
    desc: "依行程範圍選擇 JR Pass、地區周遊券或 IC 卡（Suica／ICOCA），單一城市短天數通常買 IC 卡搭配單程票更划算。",
  },
  {
    title: "網路與通訊",
    desc: "機場或網路預訂 eSIM／Wi-Fi 分享器，市區便利商店、車站也能取件，全程幾乎都收得到訊號。",
  },
  {
    title: "住宿選擇",
    desc: "膠囊旅館、商務旅館適合一人自由行，車站周邊住宿雖略貴但省下大量移動時間，深夜抵達也安心。",
  },
  {
    title: "禮儀小提醒",
    desc: "電車內保持安靜、垃圾自行帶走、排隊靠邊站好，這些小細節會讓旅程更順暢自在。",
  },
];

const itinerary = [
  { day: "Day 1", place: "抵達東京", note: "辦理 IC 卡與網路，市區周邊散步調整時差" },
  { day: "Day 2", place: "淺草．晴空塔", note: "傳統與現代交錯的東京經典路線" },
  { day: "Day 3", place: "新宿．澀谷", note: "購物與夜景，體驗都會日本" },
  { day: "Day 4", place: "搭新幹線前往京都", note: "沿途風景加上移動也是旅程一部分" },
  { day: "Day 5", place: "清水寺．祇園散策", note: "古都巷弄慢慢走，穿和服拍照也不錯" },
  { day: "Day 6", place: "嵐山．伏見稻荷", note: "竹林與千本鳥居，安排一整天悠閒逛" },
  { day: "Day 7", place: "大阪．關西機場離境", note: "最後一天補伴手禮，傍晚班機賦歸" },
];

export default function JapanPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative isolate overflow-hidden px-6 py-32 sm:py-44">
        <ParallaxHeroImage
          src="/images/japan-map-32-1024x709.jpg"
          alt="日本地區地圖"
        />
        <div className="relative mx-auto max-w-2xl">
          <div className={`${GLASS_CARD} px-8 py-10 text-center sm:px-12 sm:py-14`}>
            <p className="mb-4 text-sm tracking-[0.3em] text-muted">
              JAPAN · FREE TRAVEL
            </p>
            <h1 className="font-[family-name:var(--font-serif-tc)] text-4xl leading-tight text-foreground sm:text-5xl">
              第一次
              <br />
              日本自由行也能上手
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted">
              從地區選擇、行前準備到七日行程範例，
              帶你一步步規劃屬於自己的日本自由行。
            </p>
            <a
              href="#japan-regions"
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 text-sm text-accent transition-colors hover:bg-accent/20"
            >
              開始規劃
              <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="japan-map" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="日本地圖" title="點地圖，先搞懂大概的地理分區" />
          <div className={`${GLASS_CARD} mt-10 p-6 sm:p-10`}>
            <JapanRegionMap />
            <p className="mt-8 text-center text-sm text-muted">
              日本由北到南大致分為：北海道、東北、關東、中部、關西、中國、四國、九州、沖繩。
              新手自由行建議先鎖定 1-2 個相鄰地區，避免長途移動占掉太多行程時間。
            </p>
          </div>
        </div>
      </section>

      {/* Regions */}
      <section id="japan-regions" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="地區介紹" title="六大熱門自由行地區" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((region) => (
              <div key={region.title} className={`${GLASS_CARD} p-6`}>
                <span className="text-xs tracking-wide text-accent">
                  {region.tag}
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-serif-tc)] text-xl">
                  {region.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {region.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section id="japan-tips" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="行前準備" title="出發前必看的五件事" />
          <div className="mt-12 space-y-4">
            {tips.map((tip) => (
              <div key={tip.title} className={`${GLASS_CARD} p-6`}>
                <h3 className="font-[family-name:var(--font-serif-tc)] text-lg">
                  {tip.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample itinerary */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="行程範例" title="東京進．大阪出七日行程" />
          <div className={`${GLASS_CARD} mt-12 p-6 sm:p-10`}>
            <div className="space-y-0">
              {itinerary.map((step, i) => (
                <div key={step.day} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent">
                      {step.day}
                    </span>
                    {i !== itinerary.length - 1 && (
                      <span className="mt-2 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-10">
                    <h4 className="font-[family-name:var(--font-serif-tc)] text-lg">
                      {step.place}
                    </h4>
                    <p className="mt-1 text-sm text-muted">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs tracking-[0.3em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 font-[family-name:var(--font-serif-tc)] text-2xl text-foreground sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
