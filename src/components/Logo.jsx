import { Link } from "react-router-dom";

/** PyPrep brand mark — geometric P + code chevron. */
export function LogoMark({ className = "w-8 h-8", title = "PyPrep" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <rect width="40" height="40" rx="8" fill="#0f6e56" />
      <rect x="1.5" y="1.5" width="37" height="37" rx="6.5" stroke="#8ecbb4" strokeOpacity="0.35" />
      {/* Stylized P */}
      <path
        d="M12 30V11.5h9.2c4.05 0 6.55 2.2 6.55 5.55 0 3.45-2.55 5.7-6.7 5.7H16.4V30H12zm4.4-11.05h4.55c1.85 0 2.95-1 2.95-2.45s-1.05-2.4-2.9-2.4H16.4v4.85z"
        fill="#ffffff"
      />
      {/* Code chevron — interview / prep cue */}
      <path
        d="M27.2 22.2l3.3 3.3-3.3 3.3"
        stroke="#b8e0d0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full brand lockup.
 * @param {"dark"|"light"} tone — dark = on ink sidebar/header; light = on paper footer
 */
export default function Logo({
  tone = "dark",
  size = "md",
  showTagline = false,
  to = "/",
  className = "",
}) {
  const markSize = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-9 h-9";
  const titleCls =
    size === "sm"
      ? "text-sm"
      : size === "lg"
      ? "text-xl"
      : "text-[15px]";
  const nameColor = tone === "dark" ? "text-white" : "text-[var(--color-ink)]";
  const tagColor = tone === "dark" ? "text-[#8a9892]" : "text-[var(--color-ink-soft)]";
  const accent = "text-[#7dceb4]";

  const inner = (
    <span className={`inline-flex items-center gap-2.5 min-w-0 ${className}`}>
      <LogoMark className={`${markSize} shrink-0`} />
      <span className="min-w-0 leading-none">
        <span className={`font-display font-bold tracking-tight ${titleCls} ${nameColor}`}>
          <span className={accent}>Py</span>Prep
        </span>
        {showTagline && (
          <span
            className={`block text-[10px] mt-1 tracking-[0.12em] uppercase font-semibold ${tagColor}`}
          >
            Interview prep
          </span>
        )}
      </span>
    </span>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex hover:opacity-90 transition-opacity">
        {inner}
      </Link>
    );
  }
  return inner;
}
