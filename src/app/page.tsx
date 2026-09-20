import { Parallax } from "@/components/parallax";
import { HeroGreeting } from "@/components/hero-greeting";
import { TainanDistrictMap } from "@/components/tainan-district-map";

const spots = [
  {
    tag: "歷史街區",
    title: "神農街",
    desc: "台南最老的街道之一，兩側老屋掛著燈籠與招牌，白天寧靜、入夜氛圍更迷人，很適合一個人放慢腳步拍照。",
  },
  {
    tag: "海口夕陽",
    title: "安平老街．安平古堡",
    desc: "台灣最早的城堡遺跡，傍晚沿著運河堤岸散步看夕陽，是獨旅台南必排的行程。",
  },
  {
    tag: "百年建築",
    title: "林百貨",
    desc: "台灣第一間百貨公司，頂樓有神社遺跡與展望台，逛一層樓大約半小時，一個人也很自在。",
  },
  {
    tag: "文青選物",
    title: "正興街周邊",
    desc: "咖啡館、獨立選物店與老屋改建的小店聚集地，隨興晃進一間店就是一段小旅程。",
  },
  {
    tag: "夜間散步",
    title: "藍晒圖文創園區",
    desc: "白天是文創商場，晚上的燈光裝置與草地氛圍很放鬆，適合吃完晚餐後散步收尾。",
  },
  {
    tag: "老樹院落",
    title: "孔廟文化園區",
    desc: "全台首學，老榕樹與紅牆巷弄交錯，安靜到可以一個人坐著發呆一下午。",
  },
];

const itinerary = [
  { time: "09:00", place: "孔廟文化園區", note: "晨光中的老樹巷弄，人少好拍" },
  { time: "11:00", place: "神農街散步", note: "順路挑幾間老屋選物店" },
  { time: "12:30", place: "在地小吃午餐", note: "碗粿、擔仔麵任選" },
  { time: "14:30", place: "林百貨", note: "頂樓展望台俯瞰街景" },
  { time: "16:00", place: "安平老街．古堡", note: "傍晚前抵達，避開烈日" },
  { time: "18:00", place: "安平運河夕陽", note: "獨旅最值得留白的一刻" },
  { time: "20:00", place: "藍晒圖夜景", note: "晚餐後散步收尾" },
];

const stays = [
  {
    title: "老屋民宿",
    desc: "海安路、信義街一帶的老屋改建民宿，保留原始磚牆與天井，氛圍安靜有味道。",
  },
  {
    title: "青年旅館",
    desc: "中西區周邊選擇多，公共空間適合和其他獨旅旅人交流，也能拼團找伴同遊。",
  },
  {
    title: "運河景觀旅店",
    desc: "鄰近安平運河，晚上散步回房、清晨看日出都方便，適合想早起拍照的人。",
  },
];

export default function Home() {
  return (
    <>
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-28 sm:py-36">
          <Parallax
            speed={0.15}
            range={40}
            className="pointer-events-none absolute -top-32 left-1/2 -ml-48 h-96 w-96 rounded-full bg-accent/20 blur-[120px]"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <HeroGreeting />
            <p className="mb-4 text-sm tracking-[0.3em] text-muted">
              TAINAN · SOLO TRAVEL
            </p>
            <h1 className="font-[family-name:var(--font-serif-tc)] text-4xl leading-tight text-foreground sm:text-5xl">
              一個人的台南，
              <br />
              也能走得很自在
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted">
              老街巷弄、在地小吃、安靜的老屋咖啡館——台南的步調很適合一個人旅行。
              這裡整理了獨旅台南最值得走一趟的景點、美食與行程安排。
            </p>
            <a
              href="#spots"
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 text-sm text-accent transition-colors hover:bg-accent/20"
            >
              開始探索
              <span aria-hidden>↓</span>
            </a>
          </div>
        </section>

        {/* Districts */}
        <section id="districts" className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="地區導覽"
              title="台南各區，先選你想逛的地方"
            />
            <div className="mt-12">
              <TainanDistrictMap />
            </div>
          </div>
        </section>

        {/* Spots */}
        <section id="spots" className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeading eyebrow="景點推薦" title="巷弄與老街，慢慢走才看得到" />
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

        {/* Itinerary */}
        <section id="itinerary" className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-3xl">
            <SectionHeading eyebrow="一日行程" title="台南獨旅一日參考路線" />
            <div className="mt-12 space-y-0">
              {itinerary.map((step, i) => (
                <div key={step.time} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-accent">{step.time}</span>
                    <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                    {i !== itinerary.length - 1 && (
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

        {/* Stays */}
        <section id="stays" className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeading eyebrow="住宿建議" title="找一個能安心落腳的地方" />
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {stays.map((stay) => (
                <div
                  key={stay.title}
                  className="rounded-2xl border border-border bg-background-elevated p-6"
                >
                  <h3 className="font-[family-name:var(--font-serif-tc)] text-xl text-accent">
                    {stay.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{stay.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
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
