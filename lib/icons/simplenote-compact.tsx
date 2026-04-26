import React from 'react';

// Compact 1TXT placeholder logo, used as the empty-state placeholder in the
// note list and editor panes. Component name retained for backward-compat
// with existing imports.
export default function SimplenoteCompactLogo() {
  return (
    <svg
      className="logo"
      width="96"
      height="96"
      viewBox="0 0 176 176"
      role="img"
      aria-label="1TXT"
    >
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="92"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-3"
      >
        1T
      </text>
    </svg>
  );
}
