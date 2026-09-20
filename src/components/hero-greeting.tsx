"use client";

import { useVisitorName } from "@/hooks/use-visitor-name";

export function HeroGreeting() {
  const { name, ready } = useVisitorName();

  if (!ready || !name) return null;

  return (
    <p className="mb-3 text-sm text-accent">嗨，{name}！歡迎來到台南 👋</p>
  );
}
