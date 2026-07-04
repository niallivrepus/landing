import {
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SiteSearchContextValue = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
};

const SiteSearchContext = createContext<SiteSearchContextValue | null>(null);
const SiteSearchFullscreenOverlay = lazy(async () => {
  const mod = await import("../components/SiteSearchFullscreenOverlay");
  return { default: mod.SiteSearchFullscreenOverlay };
});

export function useSiteSearch() {
  const ctx = useContext(SiteSearchContext);
  if (!ctx) {
    throw new Error("useSiteSearch must be used within SiteSearchProvider");
  }
  return ctx;
}

export function SiteSearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((open) => !open), []);

  const value = useMemo(() => ({ open, close, toggle, isOpen }), [open, close, toggle, isOpen]);

  useEffect(() => {
    const onEvt = () => setIsOpen(true);
    window.addEventListener("jokuh-open-site-search", onEvt);
    return () => window.removeEventListener("jokuh-open-site-search", onEvt);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <SiteSearchContext.Provider value={value}>
      {children}
      {isOpen ? (
        <Suspense fallback={null}>
          <SiteSearchFullscreenOverlay onClose={close} />
        </Suspense>
      ) : null}
    </SiteSearchContext.Provider>
  );
}
