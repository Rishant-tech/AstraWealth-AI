"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PORTFOLIO_AMOUNT, normalizePortfolioAmount } from "./portfolio";

const storageKey = "astrawealth:portfolio-amount";
const eventName = "astrawealth:portfolio-amount-change";

export function usePortfolioAmount(initialAmount = DEFAULT_PORTFOLIO_AMOUNT, preferInitial = false) {
  const [amount, setAmountState] = useState(() => normalizePortfolioAmount(initialAmount));

  const setAmount = useCallback((value: number) => {
    const next = normalizePortfolioAmount(value);
    setAmountState(next);
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, String(next));
    window.dispatchEvent(new CustomEvent(eventName, { detail: next }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (preferInitial) {
      setAmount(initialAmount);
    } else {
      const saved = Number(window.localStorage.getItem(storageKey));
      if (Number.isFinite(saved) && saved >= 0) {
        setAmountState(normalizePortfolioAmount(saved));
      } else {
        window.localStorage.setItem(storageKey, String(normalizePortfolioAmount(initialAmount)));
      }
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue !== null) {
        setAmountState(normalizePortfolioAmount(Number(event.newValue)));
      }
    };
    const onCustom = (event: Event) => {
      setAmountState(normalizePortfolioAmount((event as CustomEvent<number>).detail));
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(eventName, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(eventName, onCustom);
    };
  }, [initialAmount, preferInitial, setAmount]);

  return { amount, setAmount };
}
