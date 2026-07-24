import { createContext, useContext, type ReactNode } from "react";
import {
  useClaimIdentityFlow,
  type ClaimIdentityOpenOptions,
  type ClaimIdentitySource,
} from "../hooks/useClaimIdentityFlow";

type ClaimIdentityFlowContextValue = ReturnType<typeof useClaimIdentityFlow> & {
  openFrom: (source: ClaimIdentitySource, options?: ClaimIdentityOpenOptions) => void;
};

const ClaimIdentityFlowContext = createContext<ClaimIdentityFlowContextValue | null>(null);

/**
 * **Purpose:** Shares claim-identity morph overlay state between hero, proof demo, and `IdentityBlock`.
 * **Connects to:** `ClaimIdentityLandingOverlay`, `ClaimIdentityCta`, `ProductDemoSection`.
 */
export function ClaimIdentityFlowProvider({ children }: { children: ReactNode }) {
  const flow = useClaimIdentityFlow();
  const value: ClaimIdentityFlowContextValue = {
    ...flow,
    openFrom: flow.open,
  };
  return (
    <ClaimIdentityFlowContext.Provider value={value}>{children}</ClaimIdentityFlowContext.Provider>
  );
}

export function useClaimIdentityFlowContext() {
  const context = useContext(ClaimIdentityFlowContext);
  if (!context) {
    throw new Error("useClaimIdentityFlowContext must be used within ClaimIdentityFlowProvider");
  }
  return context;
}
