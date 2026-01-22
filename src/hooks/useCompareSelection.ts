"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "skills-compare-selection";

const readSelection = () => {
  if (typeof window === "undefined") {
    return [] as string[];
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const useCompareSelection = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds(readSelection());
  }, []);

  const persist = useCallback((ids: string[]) => {
    setSelectedIds(ids);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const current = readSelection();
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      persist(next.slice(0, 2));
    },
    [persist]
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  return useMemo(
    () => ({ selectedIds, toggle, clear, isSelected }),
    [selectedIds, toggle, clear, isSelected]
  );
};
