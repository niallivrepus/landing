import { ViewIcon, ViewOffIcon } from "hugeicons-react";

import { cn } from "../../lib/utils";
import { StepCounter, type OriginColor } from "./step-counter";
import { IconOnlyButton } from "./icon-only-button";

const STRENGTH_COLOR_MAP: Record<1 | 2 | 3 | 4 | 5, OriginColor> = {
  1: "fruta", // red — very weak
  2: "fruta", // red — weak
  3: "flame", // orange — medium
  4: "solar", // yellow — strong
  5: "life", // green — very strong
};

interface PasswordSafetyProps {
  strength: 1 | 2 | 3 | 4 | 5;
  isVisible: boolean;
  onToggleVisibility: () => void;
  className?: string;
}

function PasswordSafety({ strength, isVisible, onToggleVisibility, className }: PasswordSafetyProps) {
  const color = STRENGTH_COLOR_MAP[strength];
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <StepCounter step={strength} color={color} />
      <IconOnlyButton
        className="size-[42px]"
        icon={isVisible ? <ViewIcon size={20} /> : <ViewOffIcon size={20} />}
        onClick={onToggleVisibility}
      />
    </div>
  );
}

export { PasswordSafety, type PasswordSafetyProps };
