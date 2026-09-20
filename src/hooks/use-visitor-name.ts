"use client";

import { useSyncExternalStore } from "react";

// Intentionally not persisted to localStorage/sessionStorage: the welcome
// modal should ask for a name again on every fresh visit (full page load),
// not just once per browser. It only "sticks" for as long as the current
// page stays loaded (e.g. across client-side navigation between routes).
type Listener = () => void;
const listeners = new Set<Listener>();

let currentName: string | null = null;
let currentSkipped = false;

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

export function useVisitorName() {
  const name = useSyncExternalStore(
    subscribe,
    () => currentName,
    () => null,
  );
  const skipped = useSyncExternalStore(
    subscribe,
    () => currentSkipped,
    () => false,
  );
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const saveName = (value: string) => {
    currentName = value;
    notify();
  };

  const skipWelcome = () => {
    currentSkipped = true;
    notify();
  };

  return { name, ready, skipped, saveName, skipWelcome };
}
