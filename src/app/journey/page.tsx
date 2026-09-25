import type { Metadata } from "next";
import { JourneyPlanner } from "@/components/journey-planner";
import { TainanFoodMap } from "@/components/tainan-food-map";

export const metadata: Metadata = {
  title: "AI 行程規劃 | 台南獨旅",
  description:
    "勾選想去的台灣縣市或日本都道府縣、交通方式與住宿類型，由 AI 幫你分析行程、交通與預算。",
};

export default function JourneyPage() {
  return (
    <main className="flex-1 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm tracking-[0.3em] text-muted">AI JOURNEY</p>
        <h1 className="mt-3 font-[family-name:var(--font-serif-tc)] text-4xl text-foreground">
          AI 行程規劃
        </h1>
        <p className="mt-4 max-w-2xl leading-8 text-muted">
          選好想去的地方、怎麼去、住哪裡，讓 AI 幫你排行程、分析交通與預算。
        </p>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <JourneyPlanner />
          <div className="lg:mt-12">
            <div className="lg:sticky lg:top-24">
              <TainanFoodMap />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
