import React from 'react';

// 1TXT placeholder logo. The component is intentionally still named
// `SimplenoteLogo` so existing imports (auth/about/beta-warning) keep working
// without a project-wide rename. Replace the SVG body below with the final
// brand artwork when it's ready.
export default function SimplenoteLogo() {
  return (
    <svg
      className="logo"
      width="96"
      height="96"
      viewBox="0 0 176 176"
      role="img"
      aria-label="1TXT"
    >
      <rect width="176" height="176" rx="32" ry="32" fill="#1f2937" />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="76"
        fontWeight="700"
        fill="#ffffff"
        letterSpacing="-2"
      >
        1T
      </text>
    </svg>
  );
}
