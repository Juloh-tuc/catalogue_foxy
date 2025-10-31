import React from "react";

export type ProductPanelProps = {
  title: string;
  subtitle?: string;
  topImg?: string;       // image du haut
  bottomImg?: string;    // image du bas (facultatif)
  bottomNote?: string;   // petit texte sous le tableau
  bottomBadge?: string;  // mini pastille
  children: React.ReactNode; // tableau / specs
};

export default function ProductPanel({
  title,
  subtitle,
  topImg,
  bottomImg,
  bottomNote,
  bottomBadge,
  children,
}: ProductPanelProps) {
  return (
    <section className="grid grid-rows-[auto,auto,1fr,auto,auto] gap-3 rounded-2xl bg-[#fff8f0] p-4 shadow-sm">
      <header className="static z-auto">
        <h2 className="text-xl font-semibold text-[#17196c] leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-[#17196c]/70">{subtitle}</p>}
      </header>

      {/* Image du haut */}
      {topImg && (
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#17196c]/20 bg-white static z-auto">
          <img
            src={topImg}
            alt=""
            className="block h-full w-full object-contain static z-auto"
          />
        </div>
      )}

      {/* Tableau / contenu */}
      <div className="min-h-[220px] overflow-hidden rounded-xl border border-[#17196c]/30 bg-white static z-auto">
        {children}
      </div>

      {/* Note sous tableau */}
      {(bottomBadge || bottomNote) && (
        <div className="flex items-start gap-2 text-sm static z-auto">
          {bottomBadge && (
            <span className="inline-flex shrink-0 rounded-full bg-[#e5813e]/10 text-[#e5813e] px-2 py-0.5 font-medium">
              {bottomBadge}
            </span>
          )}
          {bottomNote && <p className="text-[#17196c]/80">{bottomNote}</p>}
        </div>
      )}

      {/* Image du bas */}
      {bottomImg && (
        <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#17196c]/20 bg-white static z-auto">
          <img
            src={bottomImg}
            alt=""
            className="block h-full w-full object-contain static z-auto"
          />
        </div>
      )}
    </section>
  );
}
