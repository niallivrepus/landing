/* ─── Document Card ───────────────────────────────────────────────────
   Glass document visualization — renders children as paragraph text
   inside a frosted-glass container matching the Figma "cards / documents"
   spec (node 3:39271).
   ──────────────────────────────────────────────────────────────────── */

export interface DocumentCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DocumentCard = ({ children, className = "" }: DocumentCardProps) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: 474,
        borderRadius: 24,
        padding: 32,
        background: "var(--color-dark-glass-5)",
        border: "2px solid var(--color-light-glass-10)",
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(25px)",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Text content */}
      <div
        className="font-sans font-normal"
        style={{
          fontSize: 16,
          lineHeight: 1.56,
          color: "var(--color-light-space)",
          textShadow:
            "0px -0.5px 1px rgba(0, 0, 0, 0.5), 0px 0.5px 1px white",
        }}
      >
        {children}
      </div>

      {/* Inner shadow overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          boxShadow:
            "inset 0px 1px 1px rgba(255, 255, 255, 0.15), inset 0px 2px 3px rgba(255, 255, 255, 0.15)",
        }}
      />
    </div>
  );
};
