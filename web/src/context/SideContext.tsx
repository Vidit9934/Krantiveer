import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

/** Artist (Side A) or Label (Side B): the proposal's "I'm an Artist / I'm a Label" switch. */
export type Side = "a" | "b";

interface SideValue {
  side: Side;
  setSide: (side: Side) => void;
}

const SideContext = createContext<SideValue | null>(null);
const KEY = "kmf-side";

function readStored(): Side {
  try {
    return localStorage.getItem(KEY) === "b" ? "b" : "a";
  } catch {
    return "a";
  }
}

export function SideProvider({ children }: { children: ReactNode }) {
  const [side, setSideState] = useState<Side>(readStored);
  const setSide = useCallback((next: Side) => {
    setSideState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage can be blocked; the choice then lasts for the session only */
    }
  }, []);
  const value = useMemo(() => ({ side, setSide }), [side, setSide]);
  return <SideContext.Provider value={value}>{children}</SideContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSide(): SideValue {
  const ctx = useContext(SideContext);
  if (!ctx) throw new Error("useSide must be used inside SideProvider");
  return ctx;
}
