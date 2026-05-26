import * as React from "react";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { motion } from "motion/react";

import { useHaptics } from "../../hooks/use-haptics";
import { useShouldAnimate } from "../../hooks/use-reduced-motion";
import { cn } from "../../lib/utils";
import {
  SCALE_TRANSITION,
  getSpringTransition,
} from "../../lib/utils/animations";

function Popover({
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const haptics = useHaptics();

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        haptics.light();
      }
      onOpenChange?.(newOpen);
    },
    [onOpenChange, haptics]
  );

  return (
    <PopoverPrimitive.Root
      data-slot="popover"
      open={open}
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const shouldAnimate = useShouldAnimate();

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        asChild
        {...props}
      >
        <motion.div
          className={cn(
            "bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden",
            className
          )}
          initial={shouldAnimate ? SCALE_TRANSITION.initial : {}}
          animate={shouldAnimate ? SCALE_TRANSITION.animate : {}}
          exit={shouldAnimate ? SCALE_TRANSITION.exit : {}}
          transition={
            shouldAnimate ? getSpringTransition("snappy") : { duration: 0 }
          }
        >
          {children}
        </motion.div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
