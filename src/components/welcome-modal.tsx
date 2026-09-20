"use client";

import { useState, type FormEvent } from "react";
import { useVisitorName } from "@/hooks/use-visitor-name";

export function WelcomeModal() {
  const { name, ready, skipped, saveName, skipWelcome } = useVisitorName();
  const [value, setValue] = useState("");

  if (!ready || name || skipped) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    saveName(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 px-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background-elevated p-8 text-center shadow-2xl">
        <p className="text-xs tracking-[0.3em] text-accent">WELCOME</p>
        <h2 className="mt-3 font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">
          怎麼稱呼你？
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          留下你喜歡的稱呼，讓台南獨旅歡迎你的到來。
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={12}
            placeholder="輸入你的暱稱"
            className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-center text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="w-full rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            開始探索台南
          </button>
        </form>
        <button
          type="button"
          onClick={skipWelcome}
          className="mt-4 text-xs text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          先隨便看看
        </button>
      </div>
    </div>
  );
}
