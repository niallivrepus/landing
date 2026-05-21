import { useState } from "react";
import { cn } from "../../lib/utils";
import { PassPhoto } from "./pass-photo";
import { Badge } from "./badge";
import { IconOnlyButton } from "./icon-only-button";
import { ChevronRight } from "./chevron-right";

interface ClaimIdentityProps {
  /** Which variant to render */
  variant?: "get-identity" | "get-your-identity";
  /** Click handler for the entire card or the chevron button */
  onClick?: () => void;
  className?: string;
}

/**
 * ClaimIdentity — glass-morphism list-item card prompting users to create their username.
 *
 * Two variants:
 * - "get-identity": "Create your" + green @username badge + subtitle
 * - "get-your-identity": "Wanna see your contacts here?" + subtitle (no badge)
 */
function ClaimIdentity({ variant = "get-identity", onClick, className }: ClaimIdentityProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center justify-between overflow-clip rounded-[20px] border-2 transition-all duration-200",
        hovered
          ? "bg-light-glass-5 border-light-glass-20 backdrop-blur-[25px] shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),inset_0px_1px_2px_0px_rgba(255,255,255,0.1)]"
          : "bg-dark-glass-20 border-light-glass-10 backdrop-blur-[10px]",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left: passphoto + text */}
      <div className="flex items-center gap-3 py-2 pl-2">
        <PassPhoto src="/images/villains/villain-3.png" username="SV" pet="ghost-cat" originColor="spirit" label="My Fren" />
        <div className="flex flex-col gap-4">
          {variant === "get-identity" ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold leading-[1.4] text-light-space">Create your</span>
                <Badge color="green" variant="outline" label="@username" />
              </div>
              <p className="text-sm leading-[1.4] text-text-secondary">
                Go Infinity and go beyond.
              </p>
            </>
          ) : (
            <>
              <span className="text-base font-bold leading-[1.4] text-light-space">
                Wanna see your contacts here?
              </span>
              <p className="text-sm leading-[1.4] text-text-secondary">
                Go Infinity and go beyond.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right: chevron button */}
      <div className="pr-3">
        <IconOnlyButton icon={<ChevronRight size={20} />} onClick={onClick} />
      </div>
    </div>
  );
}

export { ClaimIdentity, type ClaimIdentityProps };
