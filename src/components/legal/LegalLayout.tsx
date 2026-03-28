import type { ReactNode } from "react";
import { TertiaryBreadcrumb, TertiaryPageChrome, type TertiaryBreadcrumbItem } from "../system";

export const legalLink = "text-[var(--color-blue-4)] transition-colors hover:underline";
export const legalMuted = "text-light-space/60 light:text-zinc-600";

export function LegalLayout({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb?: ReactNode;
}) {
  return (
    <TertiaryPageChrome breadcrumb={breadcrumb}>
      {children}
    </TertiaryPageChrome>
  );
}

export function LegalBreadcrumb({ items }: { items: TertiaryBreadcrumbItem[] }) {
  return <TertiaryBreadcrumb items={items} />;
}
