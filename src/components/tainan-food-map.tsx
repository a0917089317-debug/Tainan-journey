"use client";

import Image from "next/image";
import { useState } from "react";
import { FOOD_MAP_SIZE, foodDistricts } from "@/lib/tainan-food";

export function TainanFoodMap() {
  const [active, setActive] = useState("安平");
  const district = foodDistricts.find((d) => d.name === active);

  return (
    <aside className="rounded-2xl border border-border bg-background-elevated p-6">
      <h2 className="font-[family-name:var(--font-serif-tc)] text-xl">
        台南市美食地圖
      </h2>
      <p className="mt-1 text-xs text-muted">點地圖上的行政區，看看在地美食</p>

      <div className="relative mt-4">
        <Image
          src="/images/台南市分區地圖.png"
          alt="台南市行政區地圖"
          width={FOOD_MAP_SIZE.width}
          height={FOOD_MAP_SIZE.height}
          className="h-auto w-full"
        />
        {foodDistricts.map((d) => (
          <button
            key={d.name}
            type="button"
            aria-label={`${d.name}美食`}
            aria-pressed={active === d.name}
            onClick={() => setActive(d.name)}
            style={{
              left: `${(d.x / FOOD_MAP_SIZE.width) * 100}%`,
              top: `${(d.y / FOOD_MAP_SIZE.height) * 100}%`,
            }}
            className={`absolute h-[5%] w-[8%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors ${
              active === d.name
                ? "bg-accent/30 ring-2 ring-accent"
                : "hover:bg-white/30 hover:ring-2 hover:ring-white/70"
            }`}
          />
        ))}
      </div>

      {district && (
        <div className="mt-5">
          <h3 className="text-sm font-medium text-accent">{district.name}美食</h3>
          {district.foods.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {district.foods.map((food) => (
                <li key={food}>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`台南 ${district.name} ${food}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-full border border-border px-3 py-1 text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    {food} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-muted">資料整理中，敬請期待</p>
          )}
        </div>
      )}
    </aside>
  );
}
