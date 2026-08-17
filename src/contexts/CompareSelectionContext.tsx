"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const STORAGE_KEY = "skills-compare-selection";
const STORAGE_VERSION = 1;
const MAX_COMPARE = 2;
const STALE_AFTER_MS = 24 * 60 * 60 * 1000;

type StoredSelection = {
  version: 1;
  ids: string[];
  updatedAt: number;
};

const sanitizeIds = (value: unknown) => {
  if (!Array.isArray(value)) {
    return null;
  }

  const seen = new Set<string>();
  const sanitized: string[] = [];
  value.forEach((item) => {
    if (typeof item !== "string") {
      return;
    }
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) {
      return;
    }
    seen.add(trimmed);
    sanitized.push(trimmed);
  });

  return sanitized.slice(0, MAX_COMPARE);
};

const readSelection = (): StoredSelection | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }
  try {
    const parsed = JSON.parse(stored);
    const ids = sanitizeIds(parsed?.ids);
    const updatedAt = parsed?.updatedAt;
    const validVersion = parsed?.version === STORAGE_VERSION;
    const validTimestamp =
      typeof updatedAt === "number" &&
      Number.isFinite(updatedAt) &&
      updatedAt > 0 &&
      updatedAt <= Date.now();

    // Legacy arrays have no reliable age, so clear them rather than restoring
    // a potentially stale and confusing selection.
    if (!validVersion || !ids || ids.length === 0 || !validTimestamp) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    if (Date.now() - updatedAt > STALE_AFTER_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return { version: STORAGE_VERSION, ids, updatedAt };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

type CompareSelectionContextValue = {
  selectedIds: string[];
  toggle: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
  notice: string | null;
  setSelectionNotice: (message: string | null) => void;
  isReturningSelection: boolean;
};

const CompareSelectionContext = createContext<CompareSelectionContextValue | null>(null);

export const CompareSelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionUpdatedAt, setSelectionUpdatedAt] = useState<number | null>(null);
  const [isReturningSelection, setIsReturningSelection] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const storedSelection = readSelection();
    if (storedSelection) {
      setSelectedIds(storedSelection.ids);
      setSelectionUpdatedAt(storedSelection.updatedAt);
      setIsReturningSelection(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hydrated) {
      return;
    }

    if (selectedIds.length === 0 || selectionUpdatedAt == null) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        ids: selectedIds,
        updatedAt: selectionUpdatedAt
      })
    );
  }, [hydrated, selectedIds, selectionUpdatedAt]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        setNotice(null);
        setSelectionUpdatedAt(Date.now());
        setIsReturningSelection(false);
        return current.filter((item) => item !== id);
      }
      if (current.length >= MAX_COMPARE) {
        setNotice(`You can only compare ${MAX_COMPARE} courses.`);
        return current;
      }
      setNotice(null);
      setSelectionUpdatedAt(Date.now());
      setIsReturningSelection(false);
      return [...current, id];
    });
  }, []);

  const clear = useCallback(() => {
    setSelectedIds([]);
    setSelectionUpdatedAt(null);
    setIsReturningSelection(false);
    setNotice(null);
  }, []);

  const setSelectionNotice = useCallback((message: string | null) => {
    setNotice(message);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  const value = useMemo(
    () => ({
      selectedIds,
      toggle,
      clear,
      isSelected,
      notice,
      setSelectionNotice,
      isReturningSelection
    }),
    [
      selectedIds,
      toggle,
      clear,
      isSelected,
      notice,
      setSelectionNotice,
      isReturningSelection
    ]
  );

  return (
    <CompareSelectionContext.Provider value={value}>
      {children}
    </CompareSelectionContext.Provider>
  );
};

export const useCompareSelection = () => {
  const context = useContext(CompareSelectionContext);
  if (!context) {
    throw new Error("useCompareSelection must be used within CompareSelectionProvider");
  }
  return context;
};
