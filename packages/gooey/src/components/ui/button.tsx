import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { useHaptics } from "../../hooks/use-haptics";
import { useTheme } from "../../hooks/use-theme";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0px_2px_0px_rgba(255,255,255,1)_inset,0px_4px_4px_rgba(255,255,255,0.8)_inset]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0px_2px_2px_0px_#FFF_inset] dark:shadow-[.03px_1px_1px_0.03px_rgba(255,255,255,0.15)_inset,0px_2px_3px_0px_rgba(255,_255,_255,_0.05)_inset,0px_4px_12px_rgba(0,0,0,0.15),0px_2px_6px_rgba(0,0,0,0.1)]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        "secondary-neutral":
          "rounded-full border-2 border-[var(--color-light-glass-20)] bg-[var(--color-light-glass-5)] text-[var(--color-light-space)] font-bold backdrop-blur-[25px] shadow-[var(--shadow-pill-inset),var(--shadow-pill)] hover:bg-[var(--color-light-glass-10)] active:border-[var(--color-light-glass-5)] active:bg-[var(--color-light-space)] active:text-[var(--color-dark-space)] disabled:border-transparent disabled:opacity-40",
        "primary-neutral":
          "rounded-full border-2 border-transparent bg-[var(--color-light-space)] text-[var(--color-dark-space)] font-bold backdrop-blur-[25px] shadow-[var(--shadow-pill-inset),var(--shadow-pill)] [text-shadow:0px_-0.5px_1px_rgba(0,0,0,0.5),0px_0.5px_1px_white] hover:border-[var(--color-light-glass-20)] active:bg-[var(--color-dark-space)] active:text-[var(--color-light-space)] active:border-[var(--color-light-glass-5)] disabled:bg-[var(--color-light-glass-5)] disabled:opacity-40 disabled:border-transparent disabled:[text-shadow:none]",
        "destructive-neutral":
          "rounded-full border-2 border-[var(--color-red-4)] bg-[var(--color-red-1)] text-[var(--color-red-4)] font-bold backdrop-blur-[25px] shadow-[var(--shadow-pill-inset),var(--shadow-pill)] hover:bg-[var(--color-red-4)] hover:border-[var(--color-red-4)] hover:text-[var(--color-dark-space)] active:bg-[var(--color-light-space)] active:border-transparent active:text-[var(--color-dark-space)] disabled:opacity-40 disabled:cursor-default",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-[50px] px-5",
        "xl-icon-right": "h-[50px] pl-5 pr-4",
        "xl-icon-left": "h-[50px] pl-4 pr-5",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const haptics = useHaptics();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      haptics.light();
      onClick?.(e);
    },
    [onClick, haptics]
  );

  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={onClick}
        {...props}
      />
    );
  }

  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
}

type SecondaryButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

function SecondaryButton({
  className,
  children,
  style,
  asChild = false,
  ...props
}: SecondaryButtonProps) {
  const { isDarkMode } = useTheme();

  const defaultStyle: React.CSSProperties = {
    borderRadius: "999px",
    border: isDarkMode
      ? "1px solid rgba(255, 255, 255, 0.08)"
      : "1px solid rgba(0, 0, 0, 0.08)",
    outline: "none",
    background: isDarkMode
      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)",
    backdropFilter: isDarkMode
      ? "blur(20px) saturate(180%) brightness(0.95)"
      : "blur(20px) saturate(120%) brightness(1.05)",
    WebkitBackdropFilter: isDarkMode
      ? "blur(20px) saturate(180%) brightness(0.95)"
      : "blur(20px) saturate(120%) brightness(1.05)",
    boxShadow: "var(--shadow-pill-inset), var(--shadow-pill)",
    isolation: "isolate",
    ...style,
  };

  if (asChild) {
    return (
      <Slot
        className={cn(
          "relative w-fit flex items-center gap-1.5 px-4 min-h-10 rounded-full cursor-pointer [&_svg]:size-4",
          className
        )}
        style={defaultStyle}
        {...(props as any)}
      >
        {children as React.ReactNode}
      </Slot>
    );
  }

  return (
    <button
      className={cn(
        "relative w-fit flex items-center gap-1.5 px-4 min-h-10 rounded-full cursor-pointer [&_svg]:size-4",
        className
      )}
      style={defaultStyle}
      type="button"
      {...(props as any)}
    >
      {children as React.ReactNode}
    </button>
  );
}

export { Button, buttonVariants, SecondaryButton };
