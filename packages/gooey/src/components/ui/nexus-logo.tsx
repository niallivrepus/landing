/**
 * Nexus Logo SVG Component
 * Inline SVG that loads instantly without network requests.
 * Adapts to theme using currentColor.
 */
export function NexusLogo({
  className,
  height = 12,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "auto" }}
      height={height}
      viewBox="0 0 89 40"
      fill="none"
      className={className}
    >
      <path
        d="M73.7747 0.484365C56.458 4.53481 46.8354 14.95 44.9415 14.95C43.0476 14.95 33.4254 4.53481 16.1088 0.484365C3.51522 -2.46128 -5.02606 8.99158 3.32306 23.9671C8.47921 35.5932 13.7616 40 21.9727 40C28.479 40 32.5013 36.584 35.5241 34.596C37.8215 33.0849 41.2834 30.3683 44.942 30.3683C48.6006 30.3683 52.062 33.0849 54.3599 34.596C57.3827 36.584 61.4044 40 67.9112 40C76.1218 40 81.4048 35.5932 86.5609 23.9671C92.8632 8.34402 86.3693 -2.46079 73.7757 0.484859L73.7747 0.484365ZM37.7304 24.9386C36.1142 27.3185 24.3586 34.3605 18.0244 30.2884C11.6901 26.2162 5.7472 12.4827 9.81377 9.52864C13.8803 6.5746 41.797 18.9501 37.7304 24.9386ZM71.8586 30.2884C65.5243 34.3605 53.7688 27.319 52.1526 24.9386C48.086 18.9501 76.0031 6.57411 80.0692 9.52814C84.1353 12.4822 78.1924 26.2162 71.8586 30.2884Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Small Nexus Logo for mentions, autocomplete, etc.
 */
export function NexusLogoSmall({ className }: { className?: string }) {
  return <NexusLogo height={16} className={className} />;
}
