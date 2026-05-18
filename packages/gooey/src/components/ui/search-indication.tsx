import * as React from "react";

import { cn } from "../../lib/utils";

interface SearchIndicationProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The keyboard shortcut to display
   * @default "⌘K"
   */
  shortcut?: string;
  /**
   * Optional variant for different visual styles
   * @default "default"
   */
  variant?: "default" | "outline";
}

const SearchIndication = React.forwardRef<HTMLDivElement, SearchIndicationProps>(
  ({ className, shortcut = "⌘K", variant = "default", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center h-8 px-2.5 rounded-full text-sm font-medium transition-colors";

    const variantClasses = {
      default:
        "bg-glass-light-5 text-smoke-3 hover:bg-glass-light-10 dark:bg-glass-dark-5 dark:text-smoke-4",
      outline:
        "border border-border bg-transparent text-foreground hover:bg-accent/50",
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        data-slot="search-indication"
        {...props}
      >
        <span
          className="text-shadow-[0px_-0.5px_1px_rgba(0,0,0,0.5),0px_0.5px_1px_white]"
          style={{
            fontFamily: "var(--font-satoshi)",
            fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400",
            textShadow:
              "0px -0.5px 1px rgba(0,0,0,0.5), 0px 0.5px 1px rgba(255,255,255,1)",
          }}
        >
          {shortcut}
        </span>
      </div>
    );
  }
);

SearchIndication.displayName = "SearchIndication";

export { SearchIndication, type SearchIndicationProps };
