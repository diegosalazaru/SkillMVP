"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "skills-compare-selection";
const MAX_COMPARE = 2;

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
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setSelectedIds(readSelection());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    }
  }, [selectedIds]);

  const toggle = useCallback(
    (id: string) => {
      setSelectedIds((current) => {
        if (current.includes(id)) {
          setNotice(null);
          return current.filter((item) => item !== id);
        }
        if (current.length >= MAX_COMPARE) {
          setNotice(`Solo puedes comparar ${MAX_COMPARE} cursos por ahora.`);
          return current;
        }
        setNotice(null);
        return [...current, id];
      });
    },
    []
  );

  const clear = useCallback(() => {
    setSelectedIds([]);
    setNotice(null);
  }, []);

  const setSelectionNotice = useCallback((message: string | null) => {
    setNotice(message);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  return useMemo(
    () => ({ selectedIds, toggle, clear, isSelected, notice, setSelectionNotice }),
    [selectedIds, toggle, clear, isSelected, notice, setSelectionNotice]
  );
};
