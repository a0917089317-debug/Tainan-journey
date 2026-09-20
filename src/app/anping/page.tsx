import type { Metadata } from "next";
import Image from "next/image";
import { Parallax } from "@/components/parallax";
import { ParallaxHeroImage } from "@/components/parallax-hero-image";
import { AnpingDartGame } from "@/components/anping-dart-game";

export const metadata: Metadata = {
  title: "安平一日旅行散策 | 台南獨旅",
  description:
    "台南安平景點推薦：安平古堡、安平老街、安平樹屋、億載金城，獻給喜歡一個人慢慢走的旅人。",
};

const spots = [
  {
    tag: "歷史古蹟",
    title: "安平古堡",
    desc: "台灣最早的城堡遺跡，荷蘭時期的熱蘭遮城所在地，登上瞭望台可以俯瞰安平街區。",
  },
  {
    tag: "老街散步",
    title: "安平老街．延平街",
    desc: "台灣第一條街，蜿蜒巷弄裡藏著老屋、小吃與伴手禮店，隨走隨逛不用趕行程。",
  },
  {
    tag: "老樹奇景",
    title: "安平樹屋．德記洋行",
    desc: "百年榕樹盤根錯節爬滿整棟老倉庫，走在樹屋棧道間光影很魔幻，一個人拍照也很出片。",
  },
  {
    tag: "海防遺跡",
    title: "億載金城",
    desc: "台灣第一座西式砲台，護城河環繞、草坪開闊，傍晚時分特別寧靜好散步。",
  },
  {
    tag: "運河夕陽",
    title: "安平運河．夕游出張所",
    desc: "日治時期的鹽務辦公室改建的甜點店，運河堤岸是安平看夕陽的經典角度。",
  },
  {
    tag: "信仰中心",
    title: "開臺天后宮",
    desc: "全台開基媽祖廟之一，香火鼎盛，廟埕周邊也有不少在地小吃可以順路醫肚子。",
  },
];

const landmarks = [
  {
    title: "大魚的祝福",
    desc: "矗立在安平漁人碼頭岸邊的巨型鯨魚裝置藝術，藍天大海為背景相當壯觀，是近年來安平新興的熱門打卡地標，白天光線好時拍起來特別出片。",
    address: "台南市安平區安平漁人碼頭",
    image: { src: "/images/大魚的祝福.jpg", alt: "安平漁人碼頭大魚的祝福鯨魚裝置藝術" },
  },
  {
    title: "安平漁人碼頭夜景",
    desc: "入夜後碼頭的燈光陸續點亮，海面倒映著燈影，海風徐徐吹來，是結束一天行程後很適合一個人靜靜散步收尾的地方。",
    address: "台南市安平區安平漁人碼頭",
    image: {
      src: "/images/安平漁人碼頭夜晚點燈照片.jpg",
      alt: "安平漁人碼頭夜晚點燈景色",
    },
  },
];

const buskers = [
  {
    name: "Kenny Tim 薩克斯「瘋」手",
    tag: "薩克斯風演奏",
    url: "https://www.youtube.com/@tim1231",
    platform: "YouTube",
  },
  {
    name: "皇貴妃樂團",
    tag: "樂團演出",
    url: "https://www.facebook.com/profile.php?id=100088664447887&mibextid=ZbWKwL",
    platform: "Facebook",
  },
  {
    name: "肉腳團的堅持",
    tag: "樂團演出",
    url: "https://www.facebook.com/profile.php?id=100088664447887&mibextid=ZbWKwL",
    platform: "Facebook",
  },
  {
    name: "永恆之夜",
    tag: "樂團演出",
    url: "https://www.facebook.com/profile.php?id=100083175616744&mibextid=wwXIfr&rdid=o5Ua6fTh9l8uzWzb&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BXAiSXBgN%2F%3Fmibextid%3DwwXIfr",
    platform: "Facebook",
  },
];

const venueScheduleUrl =
  "https://buskersapply.tainan.gov.tw/index.php?inter=space&area=5&location=103&id=103t";

const eats = [
  {
    name: "牛園火鍋 安平店",
    desc: "開在安億路上，鄰近安平漁人碼頭，中式庭園風格的用餐空間，紅燈籠與梅花裝飾很有氛圍。肉盤、海鮮拼盤新鮮豐盛，湯頭選擇多，一個人也能自在吃火鍋。",
    address: "台南市安平區安億路．鄰近安平漁人碼頭",
    images: [
      { src: "/images/牛園火鍋室內用餐環境.webp", alt: "牛園火鍋安平店室內用餐環境" },
      { src: "/images/牛園火鍋-1.jpg", alt: "牛園火鍋安平店肉盤與海鮮拼盤" },
      { src: "/images/牛園火鍋-2.jpg", alt: "牛園火鍋安平店門口" },
    ],
    map: "/images/牛園火鍋安平位置圖.png",
  },
];

const walk = [
  { time: "14:00", place: "安平古堡", note: "先避開中午烈日，逛室內展區與城牆" },
  { time: "15:00", place: "延平街．安平老街", note: "巷弄慢慢晃，挑幾間老屋店家" },
  { time: "16:00", place: "安平樹屋．德記洋行", note: "樹屋棧道拍照，光線角度最好" },
  { time: "17:00", place: "億載金城", note: "護城河畔散步，人潮較少很安靜" },
  { time: "18:00", place: "安平運河堤岸", note: "找個位置坐下來等日落" },
  { time: "19:00", place: "夕游出張所", note: "吃鹽鹵冰淇淋收尾" },
];

export default function AnpingPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative isolate overflow-hidden px-6 py-32 sm:py-44">
        <ParallaxHeroImage
          src="/images/安平漁人碼頭夜晚點燈照片.jpg"
          alt="安平漁人碼頭夜晚點燈景色"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm tracking-[0.3em] text-muted drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            ANPING · TAINAN
          </p>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-4xl leading-tight text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-5xl">
            安平，
            <br />
            半天就能走完的老城
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            古堡、老街、樹屋與運河夕陽都集中在步行可達的範圍內，
            很適合一個人安排一個下午，慢慢走、慢慢晃。
          </p>
          <a
            href="#anping-spots"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 text-sm text-accent transition-colors hover:bg-accent/20"
          >
            開始探索
            <span aria-hidden>↓</span>
          </a>
        </div>
      </section>

      {/* Spots */}
      <section id="anping-spots" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="安平景點" title="步行就能串起的老城路線" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spots.map((spot) => (
              <div
                key={spot.title}
                className="group rounded-2xl border border-border bg-background-elevated p-6 transition-colors hover:border-accent/40"
              >
                <span className="text-xs tracking-wide text-accent">
                  {spot.tag}
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-serif-tc)] text-xl">
                  {spot.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">{spot.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landmarks */}
      <section id="anping-landmarks" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="安平地標" title="碼頭邊的打卡風景" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {landmarks.map((spot) => (
              <div
                key={spot.title}
                className="overflow-hidden rounded-2xl border border-border bg-background-elevated"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Parallax
                    speed={0.06}
                    range={26}
                    className="absolute inset-x-0 -top-[13%] h-[126%]"
                  >
                    <Image
                      src={spot.image.src}
                      alt={spot.image.alt}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </Parallax>
                </div>
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-serif-tc)] text-xl">
                    {spot.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {spot.desc}
                  </p>
                  <p className="mt-4 text-xs text-muted/70">
                    📍 {spot.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live music */}
      <section id="anping-live" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="現場演出" title="漁人碼頭廣場，常態街頭演出" />
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            廣場上常有不同樂團與演奏家輪番登場，點下方連結可以先聽聽看、認識一下這些表演者。
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {buskers.map((busker) => (
              <a
                key={busker.name}
                href={busker.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-background-elevated p-6 transition-colors hover:border-accent/40"
              >
                <div>
                  <span className="text-xs tracking-wide text-accent">
                    {busker.tag} · {busker.platform}
                  </span>
                  <h3 className="mt-2 font-[family-name:var(--font-serif-tc)] text-lg">
                    {busker.name}
                  </h3>
                </div>
                <span
                  aria-hidden
                  className="shrink-0 text-muted transition-colors group-hover:text-accent"
                >
                  ↗
                </span>
              </a>
            ))}
          </div>
          <a
            href={venueScheduleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            查詢廣場場地表演行程
            <span aria-hidden>↗</span>
          </a>
        </div>
      </section>

      {/* Eats */}
      <section id="anping-eats" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="安平美食" title="逛累了，安平在地推薦" />
          <div className="mt-12 space-y-8">
            {eats.map((eat) => (
              <div
                key={eat.name}
                className="overflow-hidden rounded-2xl border border-border bg-background-elevated"
              >
                <div className="grid gap-1 sm:grid-cols-3">
                  {eat.images.map((img) => (
                    <div
                      key={img.src}
                      className="relative aspect-[4/3] overflow-hidden"
                    >
                      <Parallax
                        speed={0.05}
                        range={20}
                        className="absolute inset-x-0 -top-[11%] h-[122%]"
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="(min-width: 640px) 33vw, 100vw"
                          className="object-cover"
                        />
                      </Parallax>
                    </div>
                  ))}
                </div>
                <div className="grid gap-6 p-6 sm:grid-cols-[2fr_1fr] sm:p-8">
                  <div>
                    <h3 className="font-[family-name:var(--font-serif-tc)] text-xl">
                      {eat.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      {eat.desc}
                    </p>
                    <p className="mt-4 text-xs text-muted/70">
                      📍 {eat.address}
                    </p>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-border sm:aspect-auto">
                    <Image
                      src={eat.map}
                      alt={`${eat.name}位置圖`}
                      fill
                      sizes="(min-width: 640px) 20vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dart game */}
      <section id="anping-dart" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="不知道去哪？"
            title="安平地圖飛鏢，讓緣分幫你決定"
          />
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            選好想丟幾支飛鏢，隨機射向安平地圖，鏢落在哪個景點，今天就順路去看看。
          </p>
          <div className="mt-4">
            <AnpingDartGame />
          </div>
        </div>
      </section>

      {/* Walking route */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="散步路線" title="安平半日遊參考路線" />
          <div className="mt-12 space-y-0">
            {walk.map((step, i) => (
              <div key={step.time} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-accent">{step.time}</span>
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                  {i !== walk.length - 1 && (
                    <span className="w-px flex-1 bg-border" />
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
