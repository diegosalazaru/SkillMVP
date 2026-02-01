"use client";

import { CompareSelectionProvider } from "@/contexts/CompareSelectionContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <CompareSelectionProvider>{children}</CompareSelectionProvider>;
};
