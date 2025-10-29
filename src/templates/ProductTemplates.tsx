// src/templates/ProductTemplates.tsx
import React from "react";
import type { ReactNode } from "react";

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
  template?: "double" | "single";
  category?: string;
  description?: string;
  packaging?: { temperature?: string };
  bottomNote?: string;
  bottomBadge?: string;
};

/* ========= Thème ========= */
export const FOXY_COLORS = {
  beige: "#fff8f0",
  bleu: "#191970",
  orange: "#e5813e",
} as const;

/* ========= Grille commune ========= */
export const SHEET_ROWS = "12% 28% 45% 8%";

/* ========= Cadres ========= */
export function CatalogSheet({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        w-full max-w-[1080px]
        shadow-xl rounded-xl
        px-6 md:px-8 pt-6 md:pt-8 pb-6
        mx-auto
        aspect-[210/297]
        overflow-hidden relative
        flex
        self-start
      "
      style={{ background: FOXY_COLORS.beige, color: FOXY_COLORS.bleu }}
    >
      <div
        className="relative h-full w-full grid gap-4 md:gap-5"
        style={{ gridTemplateRows: SHEET_ROWS }}
      >
        {children}
      </div>
      <PageFooter />
    </div>
  );
}

function CatalogPage({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen w-full flex items-start justify-center py-6 md:py-10"
      style={{ background: "#ffffff" }}
    >
      <CatalogSheet>{children}</CatalogSheet>
    </div>
  );
}

/* ========= Header ========= */
export function PageHeader({
  title,
  subtitle,
  temperature,
}: {
  title: string;
  subtitle?: string;
  temperature?: string;
}) {
  return (
    <header className="w-full h-full flex items-center">
      <div className="flex items-start justify-between gap-4 w-full">
        <div className="text-center mx-auto">
          <h1
            className="font-maeven text-[clamp(20px,2.6vw,34px)] font-semibold tracking-tight m-0"
            style={{ color: FOXY_COLORS.bleu }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="font-roboto text-[clamp(12px,1.4vw,16px)] opacity-90 mt-1 mb-0">
              {subtitle}
            </p>
          )}
          <div
            className="h-1 w-40 mx-auto mt-3 rounded-full"
            style={{ background: FOXY_COLORS.orange }}
          />
        </div>

        {temperature && (
          <div className="hidden md:flex items-center gap-1 text-xs md:text-sm translate-y-1">
            <img
              src="/images/temperature.png"
              alt="Température"
              className="h-5 w-5 object-contain"
            />
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
      <div
        className="h-[3px] w-full rounded-full mb-2"
        style={{ background: FOXY_COLORS.bleu }}
      />
      <div className="flex items-center justify-between text-[11px] md:text-xs opacity-90">
        <div className="flex items-center gap-3">
          <img
            src="/images/Logo_foxy.png"
            alt="FoxyTable"
            className="h-6 object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
        <span className="font-roboto" style={{ color: FOXY_COLORS.orange }}>
          foxytable.com
        </span>
      </div>
    </footer>
  );
}

/* ========= Tableau ========= */
function SpecTable({ rows }: { rows: SpecRow[] }) {
  const cols = "grid-cols-[1.1fr_0.9fr_1.1fr_0.55fr_0.55fr_0.55fr]";
  const cell = "py-2.5 px-3";
  return (
    <div className="h-full w-full rounded-lg border border-[#191970]/40 overflow-hidden bg-white flex flex-col">
      <div
        className={`grid ${cols} text-[13px] md:text-sm font-roboto font-semibold border-b border-[#191970]/40`}
      >
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
            <div
              key={i}
              className={`grid ${cols} text-[13px] md:text-sm ${
                i % 2 ? "bg-gray-50" : "bg-white"
              }`}
            >
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

/* ========= Templates ========= */
function DoubleTemplateSheet({ product }: { product: ProductRecord }) {
  const hero = product.heroImage || product.image;

  // Règles spécifiques
  const hideBottomHero =
    product.slug?.toLowerCase() === "kits-couverts-bois-et-papier" ||
    product.slug?.toLowerCase() === "kits-couverts-noyaux-olive";
  const hideTopImage =
    product.slug?.toLowerCase() === "boites-economiques-xps";

  // Image spéciale pour le film étirable
  const isFilmEtirable = product.slug?.toLowerCase() === "film-etirable";
  const filmImage = "/images/film_cuisine.png";

  const row2Cols = hideTopImage
    ? "grid-cols-1"
    : "md:grid-cols-[32%_4%_64%] grid-cols-1";

  return (
    <>
      {/* row 1 : header */}
      <div className="row-start-1 row-end-2">
        <PageHeader
          title={product.title}
          subtitle={product.subtitle}
          temperature={product.packaging?.temperature}
        />
      </div>

      {/* row 2 : image (optionnelle) + tableau */}
      <section className={`row-start-2 row-end-3 grid items-stretch h-full ${row2Cols}`}>
        {!hideTopImage && (
          <>
            <div className="rounded-lg overflow-hidden border border-[#191970]/40 bg-white h-full">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain md:object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="hidden md:block" />
          </>
        )}

        <div className="h-full min-h-0">
          <SpecTable rows={product.specs} />
        </div>
      </section>

      {/* row 3 : grande image du bas */}
      <section className="row-start-3 row-end-4 rounded-xl overflow-hidden border border-[#191970]/40 bg-white h-full">
        {hideBottomHero ? (
          <div className="w-full h-full grid place-items-center">
            <span className="text-[#191970]/40 text-sm italic">
              Espace libre (visuel à venir)
            </span>
          </div>
        ) : (
          <img
            src={isFilmEtirable ? filmImage : hero}
            alt={`${product.title} - ambiance`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
      </section>

      {/* row 4 : note/badge */}
      <section className="row-start-4 row-end-5 h-full">
        <div className="rounded-xl border border-dashed border-[#191970]/30 p-3 md:p-4 bg-white/60 h-full flex items-center justify-between">
          <p className="font-roboto text-sm md:text-base leading-relaxed mr-3">
            {product.bottomNote || "Espace libre (encart, promo, “bon plan Foxy”…)"}
          </p>
          {product.bottomBadge && (
            <span
              className="inline-block text-xs md:text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap"
              style={{ backgroundColor: `${FOXY_COLORS.orange}22`, color: FOXY_COLORS.orange }}
            >
              {product.bottomBadge}
            </span>
          )}
        </div>
      </section>
    </>
  );
}

/* ========= API ========= */
export function renderByTemplate(product: ProductRecord) {
  return (
    <CatalogPage>
      <DoubleTemplateSheet product={product} />
    </CatalogPage>
  );
}

export default renderByTemplate;
