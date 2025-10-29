import React from "react";

export default function PageBadge({ label, color }: { label: string; color: string }) {
  if (!label) return null;
  return (
    <div className="pointer-events-none absolute top-3 right-3 z-20">
      <span
        className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase shadow-sm"
        style={{ background: `${color}1A`, color, border: `1px solid ${color}55` }}
      >
        {label}
      </span>
    </div>
  );
}
