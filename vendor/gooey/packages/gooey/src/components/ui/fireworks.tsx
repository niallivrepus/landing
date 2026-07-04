"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Fireworks as FireworksJS } from "fireworks-js";
import { createPortal } from "react-dom";

const FIREWORKS_STORAGE_KEY = "jokuh_fireworks_shown";
const NEW_YEAR_CELEBRATION_DURATION = 8000;

interface FireworksContextValue {
  launchFireworks: (duration?: number) => void;
  isActive: boolean;
}

const FireworksContext = createContext<FireworksContextValue | null>(null);

function isNewYearHoliday(): boolean {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  return (month === 11 && day === 31) || (month === 0 && day <= 2);
}

function shouldShowWelcomeFireworks(): boolean {
  if (!isNewYearHoliday()) return false;
  const lastShown = localStorage.getItem(FIREWORKS_STORAGE_KEY);
  if (!lastShown) return true;
  const lastDate = new Date(lastShown);
  const now = new Date();
  return (
    lastDate.getFullYear() !== now.getFullYear() ||
    lastDate.getMonth() !== now.getMonth() ||
    lastDate.getDate() !== now.getDate()
  );
}

function markFireworksShown(): void {
  localStorage.setItem(FIREWORKS_STORAGE_KEY, new Date().toISOString());
}

// Separate component for the fireworks container - uses Portal to avoid React DOM conflicts
function FireworksContainer({
  isActive,
  onStop,
  containerRef,
}: {
  isActive: boolean;
  onStop: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    // Create a container outside React's managed DOM
    const container = document.createElement("div");
    container.id = "fireworks-portal";
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      // Cleanup - safely remove the container
      try {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      } catch {
        // Ignore cleanup errors
      }
    };
  }, []);

  if (!portalContainer) return null;

  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: isActive ? "auto" : "none",
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.5s ",
      }}
      onClick={isActive ? onStop : undefined}
    />,
    portalContainer
  );
}

export function FireworksProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fireworksRef = useRef<FireworksJS | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isActive, setIsActive] = useState(false);

  const stopFireworks = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (fireworksRef.current) {
      try {
        fireworksRef.current.stop();
        fireworksRef.current.clear();
      } catch {
        // Ignore cleanup errors
      }
      fireworksRef.current = null;
    }
    setIsActive(false);
  }, []);

  const launchFireworks = useCallback(
    (duration = 5000) => {
      // First cleanup any existing instance
      if (fireworksRef.current) {
        try {
          fireworksRef.current.stop();
          fireworksRef.current.clear();
        } catch {
          // Ignore
        }
        fireworksRef.current = null;
      }

      // Wait for next frame to ensure container is ready
      requestAnimationFrame(() => {
        if (!containerRef.current) return;

        try {
          fireworksRef.current = new FireworksJS(containerRef.current, {
            autoresize: true,
            opacity: 0.5,
            acceleration: 1.05,
            friction: 0.97,
            gravity: 1.5,
            particles: 90,
            traceLength: 3,
            traceSpeed: 10,
            explosion: 6,
            intensity: 30,
            flickering: 50,
            lineStyle: "round",
            hue: { min: 0, max: 360 },
            delay: { min: 30, max: 60 },
            rocketsPoint: { min: 0, max: 100 },
            lineWidth: {
              explosion: { min: 1, max: 3 },
              trace: { min: 1, max: 2 },
            },
            brightness: { min: 50, max: 80 },
            decay: { min: 0.015, max: 0.03 },
            mouse: { click: false, move: false, max: 1 },
            sound: {
              enabled: true,
              files: [
                "https://fireworks.js.org/sounds/explosion0.mp3",
                "https://fireworks.js.org/sounds/explosion1.mp3",
                "https://fireworks.js.org/sounds/explosion2.mp3",
              ],
              volume: { min: 1, max: 2 },
            },
          });
          fireworksRef.current.start();
          setIsActive(true);

          timeoutRef.current = setTimeout(() => {
            stopFireworks();
          }, duration);
        } catch (err) {
          console.warn("[Fireworks] Failed to initialize:", err);
        }
      });
    },
    [stopFireworks]
  );

  useEffect(() => {
    if (!shouldShowWelcomeFireworks()) return;
    const timer = setTimeout(() => {
      launchFireworks(NEW_YEAR_CELEBRATION_DURATION);
      markFireworksShown();
    }, 1500);
    return () => clearTimeout(timer);
  }, [launchFireworks]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (fireworksRef.current) {
        try {
          fireworksRef.current.stop();
          fireworksRef.current.clear();
        } catch {
          // Ignore cleanup errors
        }
        fireworksRef.current = null;
      }
    };
  }, []);

  return (
    <FireworksContext.Provider value={{ launchFireworks, isActive }}>
      {children}
      <FireworksContainer
        isActive={isActive}
        onStop={stopFireworks}
        containerRef={containerRef}
      />
    </FireworksContext.Provider>
  );
}

export function useFireworks(): FireworksContextValue {
  const context = useContext(FireworksContext);
  if (!context) {
    return { launchFireworks: () => {}, isActive: false };
  }
  return context;
}

export function isNewYearPeriod(): boolean {
  return isNewYearHoliday();
}
