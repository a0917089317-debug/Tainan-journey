"use client";

import { useState } from "react";
import { maskKey, setOpenAIKey } from "@/lib/openai-key";

export function ApiKeySettings({ apiKey }: { apiKey: string }) {
  // null = automatic: open until a key is set.
  const [open, setOpen] = useState<boolean | null>(null);
  const isOpen = open ?? !apiKey;
  const [draft, setDraft] = useState("");
  const [visible, setVisible] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const key = draft.trim();
    if (!key) return;
    setOpenAIKey(key);
    setDraft("");
    setOpen(false);
  }

  return (
    <section className="mt-10 rounded-2xl border border-border bg-background-elevated p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium">⚙ API 設定</h2>
          {apiKey ? (
            <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-0.5 text-xs text-emerald-400">
              已設定 {maskKey(apiKey)}
            </span>
          ) : (
            <span className="rounded-full border border-amber-500/50 bg-amber-500/10 px-3 py-0.5 text-xs text-amber-300">
              尚未設定
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(!isOpen)}
          className="text-xs text-muted hover:text-foreground"
        >
          {isOpen ? "收合" : apiKey ? "更換 Key" : "設定"}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={save} className="mt-4">
          <label htmlFor="openai-key" className="text-xs text-muted">
            OpenAI API Key（到{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              platform.openai.com/api-keys
            </a>{" "}
            申請）
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              id="openai-key"
              type={visible ? "text" : "password"}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="rounded-lg border border-border px-3 text-xs text-muted hover:text-foreground"
            >
              {visible ? "隱藏" : "顯示"}
            </button>
            <button
              type="submit"
              disabled={!draft.trim()}
              className="rounded-lg bg-accent px-4 text-sm font-medium text-background disabled:opacity-40"
            >
              儲存
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={() => setOpenAIKey("")}
                className="rounded-lg border border-red-400/40 px-3 text-xs text-red-300 hover:bg-red-400/10"
              >
                清除
              </button>
            )}
          </div>
          <p className="mt-3 text-xs leading-6 text-muted">
            Key 只存在你這台裝置的瀏覽器裡，每次分析時才隨請求送到本站伺服器、轉交給 OpenAI，伺服器不會儲存或記錄。
            費用會算在你自己的 OpenAI 帳戶；在公用電腦上用完請按「清除」。
          </p>
        </form>
      )}
    </section>
  );
}
