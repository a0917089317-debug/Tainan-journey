"use client";

import { useSyncExternalStore } from "react";

// Persisted to localStorage so the welcome modal only asks once per browser,
// not on every visit. "Skip" only lasts the current tab/session so a
// dismissed visitor isn't nagged again if they reload while browsing.
const NAME_KEY = "tainan-visitor-name";
const SKIP_KEY = "tainan-welcome-skipped";

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function noopSubscribe() {
  return () => {};
}

function getName() {
  try {
    return window.localStorage.getItem(NAME_KEY);
  } catch {
    return null;
  }
}

function getSkipped() {
  try {
    return window.sessionStorage.getItem(SKIP_KEY) === "1";
  } catch {
    return false;
  }
}

export function useVisitorName() {
  const name = useSyncExternalStore(subscribe, getName, () => null);
  const skipped = useSyncExternalStore(subscribe, getSkipped, () => false);
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const saveName = (value: string) => {
    try {
      window.localStorage.setItem(NAME_KEY, value);
    } catch {}
    notify();
  };

  const skipWelcome = () => {
    try {
      window.sessionStorage.setItem(SKIP_KEY, "1");
    } catch {}
    notify();
  };

  return { name, ready, skipped, saveName, skipWelcome };
}
