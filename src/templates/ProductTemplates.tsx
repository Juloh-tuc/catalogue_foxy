import React from "react";

/** === TYPES === */
export type SpecRow = { label: string; value: string };

export type ProductRecord = {
  slug: string;
  title: string;
  subtitle?: string;
  image?: string;         // image principale
  bottomImage?: string;   // image secondaire (optionnelle)
  specs: SpecRow[];       // lignes libellé/valeur
  template: "single" | "double";
  bottomNote?: string;
  bottomBadge?: string;
};

const BLUE = "#17196C";
const ORANGE = "#E5813E";

/* ---------- Icônes (depuis /public) ---------- */
const ICON_CARTON  = "/images/carton.png";
const ICON_PALETTE = "/images/palette.png";

/* ---------- Utilitaires communs ---------- */

/** Tableau simple (libellé/valeur) – pour les templates standard */
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

/** Carte neutre (contour léger) */
function SoftCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 border border-[#17196c]/10">
      {children}
    </div>
  );
}

/** Grande image encadrée (aucune h-full pour ne pas étirer la page) */
function HeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-3 flex items-center justify-center">
      <img src={src} alt={alt} className="max-w-full max-h-[420px] object-contain" />
    </div>
  );
}

/** Tableau “matrice” (entêtes fixes) avec entêtes icônes */
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
              const isIcon = typeof h !== "string" && !!h.icon;
              const width = typeof h !== "string" && h.widthPx ? h.widthPx : undefined;
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
                const key =
                  typeof h === "string" ? h : h.key;
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

/* ---------- Mise en page spéciale “kits-couverts-bois-et-papier” ---------- */

function KitsCouvertsSheet(p: ProductRecord) {
  // En-têtes : Référence | Format | Divers | [Carton icon] | [Palette icon]
  const headers: HeaderCell[] = [
    "Référence",
    "Format",
    "Divers",
    { icon: ICON_CARTON,  key: "Carton",  widthPx: 54 },
    { icon: ICON_PALETTE, key: "Palette", widthPx: 54 },
  ];

  // BOIS & PAPIER (1re num = Carton, 2e = Palette)
  const rowsBois: Record<string, string | number | undefined>[] = [
    {
      Référence: "HOT-KIT41B-500",
      Format: "Kits couverts 4/1 — 15 cm",
      Divers: "Bois",
      Carton: "500",
      Palette: "14",
    },
    {
      Référence: "HOT-KIT31B-500",
      Format: "Kits couverts 3/1 — 15 cm",
      Divers: "Bois",
      Carton: "500",
      Palette: "14",
    },
    {
      Référence: "FOX-COV-300-4-1",
      Format: "Kit couverts 4/1 — 14 cm",
      Divers: "Papier compressé imperméable",
      Carton: "300",
      Palette: "24",
    },
    {
      Référence: "FOX-COV-3-1-300",
      Format: "Kit couverts 3/1 — 14 cm",
      Divers: "Papier compressé imperméable",
      Carton: "300",
      Palette: "24",
    },
  ];

  // NOYAUX D'OLIVES
  const rowsNoyaux: Record<string, string | number | undefined>[] = [
    {
      Référence: "FOX-COV-OLI-250",
      Format: "Kits couverts 4/1 — 16 cm",
      Divers: "Noyaux d'olives",
      Carton: "250",
      Palette: "28",
    },
    {
      Référence: "FOX-COV-OLI-250-1",
      Format: "Kit couverts 3/1 — 16 cm",
      Divers: "Noyaux d'olives",
      Carton: "250",
      Palette: "28",
    },
  ];

  return (
    <div className="w-full space-y-5">
      {/* Titre */}
      <h1 className="text-3xl font-extrabold" style={{ color: BLUE }}>
        Kits couverts
      </h1>

      {/* Bloc 1 : Image (G) | Tableau (D) */}
      <section className="grid md:grid-cols-2 gap-4 items-stretch">
        <HeroImage src={p.image || "/images/kits-bois.png"} alt={p.title} />
        <MatrixTable headers={headers} rows={rowsBois} />
      </section>

      {/* Séparateur fin */}
      <div className="h-[6px] rounded-full mx-auto" style={{ width: "78%", background: ORANGE }} />

      {/* Sous-titre */}
      <h2 className="text-2xl font-bold" style={{ color: BLUE }}>
        Kits couverts en noyaux d’olives
      </h2>

      {/* Bloc 2 : Tableau (G) | Image (D) */}
      <section className="grid md:grid-cols-2 gap-4 items-stretch">
        <MatrixTable headers={headers} rows={rowsNoyaux} />
        <HeroImage src={p.bottomImage || "/images/kit_couvert_NO.png"} alt="Kits couverts en noyaux d'olives" />
      </section>

      {/* (on ne rend PAS bottomNote pour éviter le bandeau blanc) */}
    </div>
  );
}

/* ---------- Rendus standards (single/double) ---------- */

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
      {/* Colonne gauche */}
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

      {/* Colonne droite libre */}
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

/* ---------- Sélecteur principal ---------- */
/**
 * Si slug === "kits-couverts-bois-et-papier" → layout “Canva” (image + tableau avec icônes).
 * Sinon, on garde tes templates standard.
 */
export function renderByTemplate(p: ProductRecord) {
  if ((p.slug || "").toLowerCase() === "kits-couverts-bois-et-papier") {
    return <KitsCouvertsSheet {...p} />;
  }
  return p.template === "double" ? <StandardDouble {...p} /> : <StandardSingle {...p} />;
}
