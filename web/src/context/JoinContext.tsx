import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { JoinDialog } from "../components/JoinDialog";
import { LoginPanel } from "../components/LoginPanel";

export interface JoinPrefill {
  link?: string;
  language?: string;
  goal?: string;
  /** Free text appended to the WhatsApp message, for example the plan an artist picked. */
  note?: string;
}

interface JoinValue {
  openJoin: (prefill?: JoinPrefill) => void;
  openLogin: () => void;
}

const JoinContext = createContext<JoinValue | null>(null);

/**
 * There is no account system. Sign up opens a short enrollment form that hands off to WhatsApp;
 * Log in opens an honest "opens soon" panel. Both are reachable from anywhere through this context.
 */
export function JoinProvider({ children }: { children: ReactNode }) {
  const [join, setJoin] = useState<{ open: boolean; prefill: JoinPrefill }>({ open: false, prefill: {} });
  const [loginOpen, setLoginOpen] = useState(false);

  const openJoin = useCallback((prefill: JoinPrefill = {}) => {
    setLoginOpen(false);
    setJoin({ open: true, prefill });
  }, []);
  const openLogin = useCallback(() => {
    setJoin((j) => ({ ...j, open: false }));
    setLoginOpen(true);
  }, []);

  const value = useMemo(() => ({ openJoin, openLogin }), [openJoin, openLogin]);
  return (
    <JoinContext.Provider value={value}>
      {children}
      <JoinDialog open={join.open} prefill={join.prefill} onClose={() => setJoin((j) => ({ ...j, open: false }))} />
      <LoginPanel open={loginOpen} onClose={() => setLoginOpen(false)} onJoin={() => openJoin()} />
    </JoinContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useJoin(): JoinValue {
  const ctx = useContext(JoinContext);
  if (!ctx) throw new Error("useJoin must be used inside JoinProvider");
  return ctx;
}
