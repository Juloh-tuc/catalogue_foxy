import React, { type ReactNode } from "react";

/* ========= Types ========= */
export type SpecRow = {
  reference: string;
  format: string;
  divers: string;
  sac?: string;
  carton?: string;
  palette?: string;
};

export type ProductRecord = {
  slug: string;
  title: string;
  subtitle?: string;
  image: string;
  heroImage?: string;
  specs: SpecRow[];
  template?: "default" | "wideTable"; // extensible
  category?: string;
  description?: string;
  packaging?: { temperature?: string };
};

/* ========= Thème ========= */
export const FOXY_COLORS = {
  beige: "#fff8f0",
  bleu: "#191970",
  orange: "#e5813e",
} as const;

/* ========= Grille ========= */
/** Ajuste comme tu l’as fait : header 15%, bloc (image+tableau) 40%, visuel bas 35% */
export const SHEET_ROWS = "15% 40% 35%";

/* ========= Cadres ========= */
export function CatalogSheet({ children }: { children: ReactNode }) {
  return (
    <section
      className="
        w-full max-w-[1080px] aspect-[210/297]
        mx-auto rounded-2xl shadow-xl
        bg-[#fff8f0] relative overflow-hidden
      "
      style={{ color: FOXY_COLORS.bleu }}
    >
      <div
        className="relative h-full w-full grid gap-4 md:gap-5 px-6 md:px-8 pt-6 md:pt-8 pb-14"
        style={{ gridTemplateRows: SHEET_ROWS }}
      >
        {children}
      </div>
      <PageFooter />
    </section>
  );
}

export function CatalogPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-start justify-center py-6 md:py-10" style={{ background: "#ffffff" }}>
      <CatalogSheet>{children}</CatalogSheet>
    </div>
  );
}

/* ========= Header ========= */
export function PageHeader({
  title, subtitle, temperature,
}: { title: string; subtitle?: string; temperature?: string; }) {
  return (
    <header className="w-full h-full flex items-center">
      <div className="flex items-start justify-between gap-4 w-full">
        <div className="text-center mx-auto">
          <h1 className="font-maeven text-[clamp(20px,2.6vw,34px)] font-semibold tracking-tight m-0" style={{ color: FOXY_COLORS.bleu }}>
            {title}
          </h1>
          {subtitle && <p className="font-roboto text-[clamp(12px,1.4vw,16px)] opacity-90 mt-1 mb-0">{subtitle}</p>}
          <div className="h-1 w-40 mx-auto mt-3 rounded-full" style={{ background: FOXY_COLORS.orange }} />
        </div>

        {temperature && (
          <div className="hidden md:flex items-center gap-1 text-xs md:text-sm translate-y-1">
            <img src="/images/temperature.png" alt="Température" className="h-5 w-5 object-contain" />
            <span className="font-roboto">{temperature}</span>
          </div>
        )}
      </div>
    </header>
  );
}

/* ========= Footer ========= */
function PageFooter() {
  return (
    <footer className="absolute bottom-4 left-0 w-full px-6 md:px-8">
      <div className="h-[3px] w-full rounded-full mb-2" style={{ background: FOXY_COLORS.bleu }} />
      <div className="flex items-center justify-between text-[11px] md:text-xs opacity-90">
        <img src="/images/Logo_foxy.png" alt="FoxyTable" className="h-6 object-contain" loading="lazy" decoding="async" />
        <span className="font-roboto" style={{ color: FOXY_COLORS.orange }}>foxytable.com</span>
      </div>
    </footer>
  );
}

/* ========= Tableau ========= */
export function SpecTable({ rows }: { rows: SpecRow[] }) {
  const cols = "grid-cols-[1.1fr_0.9fr_1.1fr_0.55fr_0.55fr_0.55fr]";
  const cell = "py-2.5 px-3";
  return (
    <div className="h-full w-full rounded-lg border border-[#191970]/40 overflow-hidden bg-white flex flex-col">
      <div className={`grid ${cols} text-[13px] md:text-sm font-roboto font-semibold border-b border-[#191970]/40`}>
        <div className={cell}>Référence</div>
        <div className={cell}>Format</div>
        <div className={cell}>Divers</div>
        <div className={`${cell} flex items-center justify-center`} title="Sachet">
          <img src="/images/sac.png" alt="Sachet" className="h-5 w-5 object-contain" />
        </div>
        <div className={`${cell} flex items-center justify-center`} title="Carton">
          <img src="/images/carton.png" alt="Carton" className="h-5 w-5 object-contain" />
        </div>
        <div className={`${cell} flex items-center justify-center`} title="Palette">
          <img src="/images/palette.png" alt="Palette" className="h-5 w-5 object-contain" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="divide-y divide-[#191970]/20">
          {rows.map((r, i) => (
            <div key={i} className={`grid ${cols} text-[13px] md:text-sm ${i % 2 ? "bg-gray-50" : "bg-white"}`}>
              <div className={`${cell} font-semibold text-[#191970]`}>{r.reference}</div>
              <div className={`${cell} text-gray-800`}>{r.format}</div>
              <div className={`${cell} text-gray-800`}>{r.divers}</div>
              <div className={`${cell} text-center text-gray-800`}>{r.sac ?? "-"}</div>
              <div className={`${cell} text-center text-gray-800`}>{r.carton ?? "-"}</div>
              <div className={`${cell} text-center text-gray-800`}>{r.palette ?? "-"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
