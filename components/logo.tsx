// Byte-Kit logo mark: eight dots = one byte, the last dot in blue.
// The seven dots use currentColor so they adapt to the light/dark theme
// via the existing text-zinc-100 remapping.
export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`text-zinc-100 ${className}`}
      aria-hidden="true"
    >
      <g fill="currentColor">
        <circle cx="6" cy="11" r="2.8" />
        <circle cx="13" cy="11" r="2.8" />
        <circle cx="20" cy="11" r="2.8" />
        <circle cx="27" cy="11" r="2.8" />
        <circle cx="6" cy="21" r="2.8" />
        <circle cx="13" cy="21" r="2.8" />
        <circle cx="20" cy="21" r="2.8" />
      </g>
      <circle cx="27" cy="21" r="2.8" fill="#3b82f6" />
    </svg>
  );
}
