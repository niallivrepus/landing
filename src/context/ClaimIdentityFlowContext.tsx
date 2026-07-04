import { createContext, useContext, type ReactNode } from "react";
import { useClaimIdentityFlow, type ClaimIdentitySource } from "../hooks/useClaimIdentityFlow";

type ClaimIdentityFlowContextValue = ReturnType<typeof useClaimIdentityFlow> & {
  openFrom: (source: ClaimIdentitySource) => void;
};

const ClaimIdentityFlowContext = createContext<ClaimIdentityFlowContextValue | null>(null);

/**
 * **Purpose:** Shares claim-identity morph overlay state between hero and `IdentityBlock`.
 * **Connects to:** `ClaimIdentityLandingOverlay`, `ClaimIdentityCta`.
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
