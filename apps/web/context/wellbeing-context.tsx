"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { WellbeingSettings } from "@/lib/types";
import { getWellbeingSettings } from "@/lib/posts";
import { useAuth } from "@/context/auth-context";

const DEFAULTS: WellbeingSettings = {
  reducedNotifications: true,
  hideInteractions: false,
  limitedFeed: true,
  silentMode: false,
  darkMode: false,
};

interface WellbeingContextType {
  settings: WellbeingSettings;
  refresh: () => void;
}

const WellbeingContext = createContext<WellbeingContextType>({
  settings: DEFAULTS,
  refresh: () => {},
});

export function WellbeingProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<WellbeingSettings>(DEFAULTS);

  const refresh = useCallback(() => {
    if (!isAuthenticated) return;
    getWellbeingSettings()
      .then(setSettings)
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <WellbeingContext.Provider value={{ settings, refresh }}>
      {children}
    </WellbeingContext.Provider>
  );
}

export function useWellbeing() {
  return useContext(WellbeingContext);
}
