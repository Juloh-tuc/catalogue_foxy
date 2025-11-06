// src/templates/ProductTemplates.tsx
import React from "react";

/** === TYPES === */
export type SpecRow = { label: string; value: string };

export type ProductRecord = {
  slug: string;
  title: string;
  subtitle?: string;
  image?: string;         // image principale (bloc haut)
  bottomImage?: string;   // image secondaire (mise en situation bas de page)
  specs: SpecRow[];
  template: "single" | "double";
  bottomNote?: string;
  bottomBadge?: string;
};

const BLUE = "#17196C";

/* ---------- Icônes (depuis /public) ---------- */
const ICON_CARTON  = "/images/carton.png";
const ICON_PALETTE = "/images/palette.png";

/* ---------- Images par défaut ---------- */
const DEFAULT_MISE_SCENE_BOL = "/images/mise_scene_bol.png";

/* ====================================================================== */
/*  Utilitaires communs                                                    */
/* ====================================================================== */

function SpecsTable({ rows }: { rows: SpecRow[] }) {
  const clean =
    (rows ?? [])
      .filter(r => r?.label && r?.value)
      .map(r => ({ label: String(r.label).trim(), value: String(r.value).trim() }))
      .filter(r => r.label && r.value);

  if (!clean.length) {
    return <div className="p-3 text-sm text-[#17196c]/70">Aucune spécification disponible.</div>;
  }

  return (
    <div className="w-full">
      <table className="w-full text-sm">
        <tbody>
          {clean.map((r, i) => (
            <tr key={`${r.label}-${i}`} className={i % 2 ? "bg-[#17196c]/[0.03]" : ""}>
              <th
                scope="row"
                className="text-left font-semibold text-[#17196c] px-3 py-2 w-40 border-b border-[#17196c]/10 align-top"
              >
                {r.label}
              </th>
              <td className="px-3 py-2 border-b border-[#17196c]/10">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SoftCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 border border-[#17196c]/10">
      {children}
    </div>
  );
}

function HeroImage({ src, alt, maxH = 420 }: { src: string; alt: string; maxH?: number }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-3 flex items-center justify-center">
      <img src={src} alt={alt} className="max-w-full object-contain" style={{ maxHeight: maxH }} />
    </div>
  );
}

/** Tableau “matrice” (entêtes fixes) avec entêtes icônes/texte */
type HeaderCell =
  | string
  | { icon?: string; key: string; widthPx?: number };

function MatrixTable({
  headers,
  rows,
}: {
  headers: HeaderCell[];
  rows: Record<string, string | number | undefined>[];
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-3 w-full">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => {
              const isIcon = typeof h !== "string" && !!(h as any).icon;
              const width = typeof h !== "string" && (h as any).widthPx ? (h as any).widthPx : undefined;
              return (
                <th
                  key={i}
                  className="text-left px-2 py-2 font-semibold"
                  style={{ color: BLUE, width }}
                >
                  {isIcon ? (
                    <img
                      src={(h as any).icon}
                      alt=""
                      className="inline-block align-middle"
                      style={{ height: 16 }}
                    />
                  ) : (
                    (h as string)
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t">
              {headers.map((h, hi) => {
                const key = typeof h === "string" ? h : (h as any).key;
                return (
                  <td key={hi} className="px-2 py-2">
                    {r[key] ?? ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* helper pour masquer une image cassée */
const hideOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  (e.currentTarget as HTMLImageElement).style.display = "none";
};

/* ====================================================================== */
/*  Spécial – Kits couverts (2 tableaux) — INTACT                         */
/* ====================================================================== */

function KitsCouvertsSheet(p: ProductRecord) {
  const headers: HeaderCell[] = [
    "Référence",
    "Format",
    "Divers",
    { icon: ICON_CARTON,  key: "Carton",  widthPx: 54 },
    { icon: ICON_PALETTE, key: "Palette", widthPx: 54 },
  ];

  const rowsBois = [
    { Référence: "HOT-KIT41B-500", Format: "Kits couverts 4/1 — 15 cm", Divers: "Bois", Carton: "500", Palette: "14" },
    { Référence: "HOT-KIT31B-500", Format: "Kits couverts 3/1 — 15 cm", Divers: "Bois", Carton: "500", Palette: "14" },
    { Référence: "FOX-COV-300-4-1", Format: "Kit couverts 4/1 — 14 cm", Divers: "Papier compressé imperméable", Carton: "300", Palette: "24" },
    { Référence: "FOX-COV-3-1-300", Format: "Kit couverts 3/1 — 14 cm", Divers: "Papier compressé imperméable", Carton: "300", Palette: "24" },
  ];

  const rowsNoyaux = [
    { Référence: "FOX-COV-OLI-250",   Format: "Kits couverts 4/1 — 16 cm", Divers: "Noyaux d'olives", Carton: "250", Palette: "28" },
    { Référence: "FOX-COV-OLI-250-1", Format: "Kit couverts 3/1 — 16 cm",  Divers: "Noyaux d'olives", Carton: "250", Palette: "28" },
  ];

  return (
    <div className="w-full space-y-5">
      <h1 className="text-3xl font-extrabold" style={{ color: BLUE }}>Kits couverts</h1>

      <section className="grid md:grid-cols-2 gap-4 items-stretch">
        <HeroImage src={p.image || "/images/kits-bois.png"} alt={p.title} />
        <MatrixTable headers={headers} rows={rowsBois} />
      </section>

      <div className="h-[6px] rounded-full mx-auto" style={{ width: "78%", background: "#E5813E" }} />

      <h2 className="text-2xl font-bold" style={{ color: BLUE }}>Kits couverts en noyaux d’olives</h2>

      <section className="grid md:grid-cols-2 gap-4 items-stretch">
        <MatrixTable headers={headers} rows={rowsNoyaux} />
        <HeroImage src={p.bottomImage || "/images/kit_couvert_NO.png"} alt="Kits couverts en noyaux d'olives" />
      </section>
    </div>
  );
}

/* ====================================================================== */
/*  Spécial – Boîtes économiques XPS (référence de layout)                */
/* ====================================================================== */

function BoitesXpsSheet(p: ProductRecord) {
  const headers: HeaderCell[] = [
    "Référence",
    "Format",
    "Divers",
    { icon: ICON_CARTON,  key: "Carton",  widthPx: 54 },
    { icon: ICON_PALETTE, key: "Palette", widthPx: 54 },
  ];

  const rowsXps = [
    { Référence: "XPS-BOX-145", Format: "145 × 136 × 75 mm", Divers: "XPS blanc", Carton: "1000", Palette: "8,5" },
    { Référence: "XPS-BOX-185", Format: "185 × 133 × 75 mm", Divers: "XPS blanc", Carton: "1000", Palette: "8,5" },
  ];

  return (
    <div className="w-full space-y-20">
      <h1 className="text-3xl font-extrabold" style={{ color: BLUE }}>
        {p.title || "Boîtes économiques XPS"}
      </h1>

      <section className="grid md:grid-cols-2 gap-6 items-stretch">
        <HeroImage src={p.image || "/images/boite_burger.png"} alt={p.title || "Boîtes XPS"} />
        <MatrixTable headers={headers} rows={rowsXps} />
      </section>

      <div className="rounded-xl overflow-hidden border border-neutral-200 mt-32">
        <img
          src={p.bottomImage || DEFAULT_MISE_SCENE_BOL}
          alt="Mise en situation"
          className="w-full object-cover"
        />
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Spécial – Boîtes PIZZA (layout XPS, titre fixe, image bas réduite)    */
/* ====================================================================== */

function BoitesPizzaSheet(p: ProductRecord) {
  const headers: HeaderCell[] = [
    "Référence",
    "Format (cm)",
    "Divers",
    { icon: ICON_CARTON,  key: "Carton",  widthPx: 54 },
    { icon: ICON_PALETTE, key: "Palette", widthPx: 54 },
  ];

  const rowsPizza = [
    { Référence: "FPK-PBOX26-100", Format: "26 × 26 × 4", Divers: "Carton", Carton: "100", Palette: "90" },
    { Référence: "FPK-PBOX29-100", Format: "29 × 29 × 4", Divers: "Carton", Carton: "100", Palette: "45" },
    { Référence: "FPK-PBOX31-100", Format: "31 × 31 × 4", Divers: "Carton", Carton: "100", Palette: "45" },
    { Référence: "FPK-PBOX33-100", Format: "33 × 33 × 4", Divers: "Carton", Carton: "100", Palette: "45" },
    { Référence: "FPK-PBOX40-100", Format: "40 × 40 × 4", Divers: "Carton", Carton: "100", Palette: "45" },
  ];

  return (
    <div className="w-full space-y-20">
      <h1 className="text-3xl font-extrabold" style={{ color: BLUE }}>
        Boîtes pizza
      </h1>

      <section className="grid md:grid-cols-2 gap-6 items-stretch">
        <HeroImage src={p.image || "/images/boite_pizza.png"} alt="Boîtes pizza" />
        <MatrixTable headers={headers} rows={rowsPizza} />
      </section>

      <div className="rounded-xl overflow-hidden border border-neutral-200 mt-24">
        <img
          src={p.bottomImage || "/images/pizza_scene.png"}
          alt="Mise en situation pizza"
          className="w-full object-cover"
          style={{ maxHeight: 360 }}
          onError={hideOnError}
        />
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Spécial – Pailles (layout XPS, sans encadré bas + image un peu + grande) */
/* ====================================================================== */

function PaillesSheet(p: ProductRecord) {
  const headers: HeaderCell[] = [
    "Référence",
    "Format",
    "Divers",
    { icon: ICON_CARTON,  key: "Carton",  widthPx: 54 },
    { icon: ICON_PALETTE, key: "Palette", widthPx: 54 },
  ];

  const fromVariants: any[] = Array.isArray((p as any).variants) ? (p as any).variants : [];
  const rowsFallbackPailles = [
    { Référence: "FOX-STR-20-8-500-OLI-N", Format: "8 mm  20 cm",  Divers: "Noires – Noyaux d’olive", Carton: "500", Palette: "40" },
    { Référence: "FOX-STR-20-6-250-AVO-N", Format: "6 mm  20 cm",  Divers: "Noires – Noyaux d’avocat", Carton: "250", Palette: "40" },
    { Référence: "FOX-STR-14-6-500-OLI-N", Format: "6 mm / 14cm", Divers: "Noires – Noyaux d’olive", Carton: "500", Palette: "40" },
    { Référence: "FOX-STR-20-6-500-OLI-N", Format: "6 mm 20 cm",   Divers: "Noires – Noyaux d’olive", Carton: "500", Palette: "45" },
    { Référence: "PUB-PAILLE-500",         Format: "6 mm 20 cm",   Divers: "Carton",                   Carton: "500", Palette: "40" },
  ];

  const rowsFromVariants = fromVariants.map((v) => ({
    "Référence": v.reference ?? "",
    "Format":    v.format ?? "",
    "Divers":    v.matiere ?? "",
    "Carton":    v.carton ?? "",
    "Palette":   v.palette ?? "",
  }));

  const rows = rowsFromVariants.length ? rowsFromVariants : rowsFallbackPailles;

  return (
    <div className="w-full space-y-16">
      <h1 className="text-3xl font-extrabold" style={{ color: BLUE }}>
        Pailles
      </h1>

      {/* Image + tableau */}
      <section className="grid md:grid-cols-2 gap-6 items-stretch">
        <HeroImage src={p.image || "/images/pailles.png"} alt="Pailles" maxH={340} />
        <MatrixTable headers={headers} rows={rows} />
      </section>

      {/* pas d'encadré + image plus grande */}
      <div className="mt-16">
        <img
          src={p.bottomImage || "/images/page_table_matier.png"}
          alt="Mise en situation pailles"
          className="w-full object-contain"
          style={{ maxHeight: 360 }}
          onError={hideOnError}
        />
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Spécial – Film étirable (layout XPS, SANS encadré bas + image + basse et + grande) */
/* ====================================================================== */

function FilmEtirableSheet(p: ProductRecord) {
  const headers: HeaderCell[] = [
    "Référence",
    "Format",
    "Divers",
    { icon: ICON_CARTON,  key: "Carton",  widthPx: 54 },
    { icon: ICON_PALETTE, key: "Palette", widthPx: 54 },
  ];

  // variants si dispo, sinon fallback
  const fromVariants: any[] = Array.isArray((p as any).variants) ? (p as any).variants : [];
  const rowsFromVariants = fromVariants.map((v) => ({
    "Référence": v.reference ?? "",
    "Format":    v.format ?? "",
    "Divers":    v.matiere ?? "Film alimentaire",
    "Carton":    v.carton ?? "",
    "Palette":   v.palette ?? "",
  }));

  const rowsFallback = [
    { "Référence": "HOT-FILM30-6", "Format": "300 x 0,30", "Divers": "Film alimentaire", "Carton": "6", "Palette": "-" },
    { "Référence": "HOT-FILM45-6", "Format": "300 x 0,45", "Divers": "Film alimentaire", "Carton": "6", "Palette": "-" },
  ];

  const rows = rowsFromVariants.length ? rowsFromVariants : rowsFallback;

  return (
    <div className="w-full space-y-16">
      <h1 className="text-3xl font-extrabold" style={{ color: BLUE }}>
        Film étirable
      </h1>

      {/* même structure que XPS */}
      <section className="grid md:grid-cols-2 gap-6 items-stretch">
        <HeroImage src={p.image || "/images/film_etirable.png"} alt="Film étirable" maxH={340} />
        <MatrixTable headers={headers} rows={rows} />
      </section>

      {/* plus bas + plus grand, sans encadré */}
      <div className="mt-28">
        <img
          src={p.bottomImage || "/images/film_cuisine.png"}
          alt="Mise en situation film étirable"
          className="w-full object-contain"
          style={{ maxHeight: 440 }}
          onError={hideOnError}
        />
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Rendus standards                                                      */
/* ====================================================================== */

function StandardSingle(p: ProductRecord) {
  return (
    <div className="w-full">
      <SoftCard>
        <h2 className="text-lg font-bold text-[#17196c]">{p.title}</h2>
        {p.subtitle && <div className="text-xs opacity-70 mb-2">{p.subtitle}</div>}
        {p.image && (
          <div className="rounded-xl overflow-hidden border border-[#17196c]/10 mb-3">
            <img src={p.image} alt={p.title} className="w-full object-cover" />
          </div>
        )}
        <SpecsTable rows={p.specs} />
        {p.bottomImage && (
          <div className="rounded-xl overflow-hidden border border-[#17196c]/10 mt-3">
            <img src={p.bottomImage} alt="" className="w-full object-cover" />
          </div>
        )}
      </SoftCard>
    </div>
  );
}

function StandardDouble(p: ProductRecord) {
  return (
    <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SoftCard>
        <h2 className="text-lg font-bold text-[#17196c]">{p.title}</h2>
        {p.subtitle && <div className="text-xs opacity-70 mb-2">{p.subtitle}</div>}
        {p.image && (
          <div className="rounded-xl overflow-hidden border border-[#17196c]/10 mb-3">
            <img src={p.image} alt={p.title} className="w-full object-cover" />
          </div>
        )}
        <SpecsTable rows={p.specs} />
      </SoftCard>

      <SoftCard>
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-[#17196c]">Informations</h3>
          <p className="text-sm text-[#17196c]/80">
            Ajoute ici un encart (produits associés, logos clients, note commerciale, etc.).
          </p>
          {p.bottomImage && (
            <div className="rounded-xl overflow-hidden border border-[#17196c]/10">
              <img src={p.bottomImage} alt="" className="w-full object-cover" />
            </div>
          )}
        </div>
      </SoftCard>
    </div>
  );
}

/* ====================================================================== */
/*  Sélecteur principal — routage robuste                                 */
/* ====================================================================== */

export function renderByTemplate(p: ProductRecord) {
  const slug = String(p.slug || "").toLowerCase().trim();

  // Routage souple par "contient"
  if (slug.includes("kits-couverts")) return <KitsCouvertsSheet {...p} />;
  if (slug.includes("xps"))           return <BoitesXpsSheet {...p} />;
  if (slug.includes("pizza"))         return <BoitesPizzaSheet {...p} />;
  if (slug.includes("paille"))        return <PaillesSheet {...p} />;
  if (slug.includes("film"))          return <FilmEtirableSheet {...p} />;

  // Fallbacks exacts
  if (slug === "kits-couverts-bois-et-papier") return <KitsCouvertsSheet {...p} />;
  if (slug === "boites-economiques-xps")      return <BoitesXpsSheet {...p} />;
  if (slug === "boites-pizza")                return <BoitesPizzaSheet {...p} />;
  if (slug === "pailles")                     return <PaillesSheet {...p} />;
  if (slug === "film-etirable")               return <FilmEtirableSheet {...p} />;

  // Standards
  return p.template === "double" ? <StandardDouble {...p} /> : <StandardSingle {...p} />;
}
