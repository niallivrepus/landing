import * as React from "react";

import { cn } from "../../lib/utils";
import { ChevronRight } from "./chevron-right";
import { Plus } from "./plus";

/**
 * Crumb - Breadcrumb navigation component
 *
 * Beautiful glass-morphic breadcrumb with pill-shaped items, chevron dividers,
 * and an optional add button. Designed for dark themes with backdrop blur.
 *
 * Usage:
 * ```tsx
 * <Crumb>
 *   <CrumbItem>Vault</CrumbItem>
 *   <CrumbItem>music</CrumbItem>
 *   <CrumbItem active>my beats</CrumbItem>
 *   <CrumbAddButton onClick={() => {}} />
 * </Crumb>
 * ```
 */

interface CrumbProps {
  children: React.ReactNode;
  className?: string;
}

function Crumb({ children, className }: CrumbProps) {
  // Insert dividers between CrumbItems (not before CrumbAddButton)
  const childArray = React.Children.toArray(children);
  const itemsWithDividers: React.ReactNode[] = [];

  childArray.forEach((child, index) => {
    const isAddButton =
      React.isValidElement(child) && child.type === CrumbAddButton;
    const isLastBeforeAdd =
      index === childArray.length - 2 &&
      React.isValidElement(childArray[childArray.length - 1]) &&
      (childArray[childArray.length - 1] as React.ReactElement).type ===
        CrumbAddButton;
    const isLast = index === childArray.length - 1;

    itemsWithDividers.push(child);

    // Add divider after items, but not after the last item or before add button
    if (!isLast && !isAddButton && !isLastBeforeAdd) {
      itemsWithDividers.push(<CrumbDivider key={`divider-${index}`} />);
    }
  });

  return (
    <nav
      className={cn(
        "inline-flex flex-row flex-nowrap items-center gap-2 p-1 rounded-full",
        "dark:bg-dark-glass-5 dark:border dark:border-light-glass-5",
        "bg-white border border-[#D4D4D8]",
        "dark:backdrop-blur-[25px]",
        "relative",
        className
      )}
      style={{
        boxShadow: "none",
      }}
    >
      {itemsWithDividers}
    </nav>
  );
}

interface CrumbItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

function CrumbItem({ children, active, onClick, className }: CrumbItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center h-10 px-5 rounded-full shrink-0",
        "dark:backdrop-blur-[10px]",
        "dark:text-light-space text-foreground text-base font-normal leading-[1.4]",
        "transition-colors cursor-pointer",
        active
          ? "dark:bg-light-glass-10 bg-white border border-[#D4D4D8]"
          : "dark:bg-light-glass-5 dark:hover:bg-light-glass-10 bg-white border border-[#E4E4E7] hover:border-[#D4D4D8]",
        className
      )}
    >
      {children}
    </button>
  );
}

function CrumbDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-1 self-stretch rounded-full shrink-0",
        "dark:bg-light-glass-5 dark:backdrop-blur-[10px]",
        "bg-white border border-[#E4E4E7]",
        className
      )}
    >
      <ChevronRight size={12} className="dark:text-light-space dark:opacity-60 text-[#A1A1AA]" />
    </div>
  );
}

interface CrumbAddButtonProps {
  onClick?: () => void;
  className?: string;
}

function CrumbAddButton({ onClick, className }: CrumbAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center size-10 rounded-full shrink-0",
        "dark:bg-light-glass-5 dark:backdrop-blur-[10px]",
        "bg-white border border-[#E4E4E7] hover:border-[#D4D4D8]",
        "dark:hover:bg-light-glass-10 transition-colors cursor-pointer",
        className
      )}
    >
      <Plus size={16} className="dark:text-light-space text-[#71717A]" />
    </button>
  );
}

export { Crumb, CrumbItem, CrumbDivider, CrumbAddButton };
