// src/pages/ProductPage.tsx
import { useEffect, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import data from "../data/products.json";
import { renderByTemplate } from "../templates/ProductTemplates";
import type { ProductRecord, SpecRow } from "../templates/ProductTemplates";

/* ---------------- Parsing tolérant ---------------- */
type VariantRow = { reference?: string; libelle?: string; format?: string; matiere?: string; cond?: string; carton?: string; };
type RawProduct = { slug?: string; name?: string; category?: string; image?: string; image2?: string; description?: string; template?: string; badges?: string[]; variants?: VariantRow[]; };

function getRawArray(x: unknown): RawProduct[] {
  if (Array.isArray(x)) return x as RawProduct[];
  if (x && typeof x === "object") {
    const o = x as any;
    if (Array.isArray(o.products)) return o.products as RawProduct[];
    if (Array.isArray(o.items)) return o.items as RawProduct[];
  }
  return [];
}
function normalizeTemplate(t?: string): ProductRecord["template"] {
  return t === "single" || t === "double" ? t : "double";
}
function toSpecs(variants?: VariantRow[]): SpecRow[] {
  if (!variants || variants.length === 0) return [];
  const uniq = (arr: (string | undefined)[]) => Array.from(new Set(arr.filter(Boolean) as string[]));
  const formats  = uniq(variants.map(v => v.format)).join(", ");
  const matieres = uniq(variants.map(v => v.matiere)).join(", ");
  const conds    = uniq(variants.map(v => v.cond)).join(", ");
  const cartons  = uniq(variants.map(v => v.carton)).join(", ");
  const rows: SpecRow[] = [{ label: "Références", value: `${variants.length} disponibles` }];
  if (formats)  rows.push({ label: "Formats", value: formats });
  if (matieres) rows.push({ label: "Matière", value: matieres });
  if (conds)    rows.push({ label: "Conditionnement", value: conds });
  if (cartons)  rows.push({ label: "Carton", value: cartons });
  return rows;
}
function toRecord(raw: RawProduct): ProductRecord {
  return {
    slug: raw.slug ?? "",
    title: raw.name ?? "(Sans titre)",
    subtitle: raw.category || undefined,
    image: raw.image || undefined,
    bottomImage: raw.image2 || undefined,
    specs: toSpecs(raw.variants),
    template: normalizeTemplate(raw.template),
    bottomNote: raw.description || undefined,
    bottomBadge: Array.isArray(raw.badges) && raw.badges[0] ? raw.badges[0] : undefined,
  };
}

/* ---------------- Composants A4 locaux ---------------- */
const BLUE = "#17196C";
const ORANGE = "#E5813E";

type Row = { reference: string; format: string; divers: string; sachet: string; carton: string };

function Table({ rows }: { rows: Row[] }) {
  const headers = ["Référence", "Format", "Divers", "Sachet", "Carton"];
  return (
    <div className="bg-white rounded-xl border border-[#17196c]/15 p-3 h-full">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} className="text-left px-2 py-2 font-semibold" style={{ color: BLUE }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-[#17196c]/10">
              <td className="px-2 py-2">{r.reference}</td>
              <td className="px-2 py-2">{r.format}</td>
              <td className="px-2 py-2">{r.divers}</td>
              <td className="px-2 py-2">{r.sachet}</td>
              <td className="px-2 py-2">{r.carton}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#17196c]/15 p-3 h-full flex items-center justify-center">
      <img src={src} alt={alt} className="max-h-[360px] w-auto object-contain" />
    </div>
  );
}

/* ---------------- Page Produit ---------------- */
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/404" replace />;

  // Masquer le rail/side sur les pages produit
  useEffect(() => {
    document.documentElement.classList.add("hide-sidenav");
    return () => document.documentElement.classList.remove("hide-sidenav");
  }, []);

  // Charger + normaliser
  const raw = useMemo(() => getRawArray(data as unknown), []);
  const normalized = useMemo(() => raw.map(toRecord), [raw]);
  const product = useMemo(() => normalized.find(p => p.slug === slug), [normalized, slug]);

  if (raw.length === 0) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="text-center max-w-md">
          <p className="text-2xl font-bold mb-2">Aucun produit chargé</p>
          <p className="opacity-80 mb-4 text-sm">
            Vérifie la structure de <code>/data/products.json</code> (tableau ou clé <code>products</code>).
          </p>
          <Link to="/catalogue" className="underline">Retour au catalogue</Link>
        </div>
      </main>
    );
  }
  if (!product) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="text-center">
          <p className="text-2xl font-bold mb-3">Produit introuvable</p>
          <Link to="/catalogue" className="underline">Retour au catalogue</Link>
        </div>
      </main>
    );
  }

  /* === Mise en page A4 dédiée : kits-couverts-bois-et-papier === */
  if (slug === "kits-couverts-bois-et-papier") {
    const rowsBois: Row[] = [
      { reference: "HOT-KIT41B-500",  format: "Kits couverts 4/1 — 15 cm", divers: "Bois",                           sachet: "500", carton: "14" },
      { reference: "HOT-KIT31B-500",  format: "Kits couverts 3/1 — 15 cm", divers: "Bois",                           sachet: "500", carton: "14" },
      { reference: "FOX-COV-300-4-1", format: "Kit couverts 4/1 — 14 cm",  divers: "Papier compressé imperméable",   sachet: "300", carton: "24" },
      { reference: "FOX-COV-3-1-300", format: "Kit couverts 3/1 — 14 cm",  divers: "Papier compressé imperméable",   sachet: "300", carton: "24" },
    ];
    const rowsNoyaux: Row[] = [
      { reference: "FOX-COV-OLI-250",   format: "Kits couverts 4/1 — 16 cm", divers: "Noyaux d'olives", sachet: "250", carton: "28" },
      { reference: "FOX-COV-OLI-250-1", format: "Kit couverts 3/1 — 16 cm",  divers: "Noyaux d'olives", sachet: "250", carton: "28" },
    ];

    return (
      <div className="w-full flex justify-center">
        {/* Feuille A4 */}
        <main className="rounded-2xl shadow-xl" style={{ background: "#FFF8F0", width: 794, minHeight: 1123 }}>
          <section className="p-8 space-y-6">
            {/* Titre */}
            <h1 className="text-3xl font-extrabold" style={{ color: BLUE }}>Kits couverts</h1>

            {/* Bloc 1 : Tableau G / Photo D */}
            <div className="grid md:grid-cols-2 gap-4 items-stretch">
              <Table rows={rowsBois} />
              <Photo src="/images/kits-bois.png" alt="Kits couverts bois & papier" />
            </div>

            {/* Trait orange */}
            <div className="h-[6px] rounded-full" style={{ background: ORANGE, width: "85%" }} />

            {/* Bloc 2 : Mise en situation G / Titre + petit tableau D */}
            <div className="grid md:grid-cols-2 gap-4 items-start">
              <div className="bg-white rounded-xl border border-[#17196c]/15 p-3">
                <img src="/images/repas_couvert.png" alt="Mise en situation — kits couverts" className="w-full rounded-lg object-cover" />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold leading-snug" style={{ color: BLUE }}>
                  Kits couverts en<br />noyaux d’olives
                </h2>
                <div className="max-w-[420px]">
                  <Table rows={rowsNoyaux} />
                </div>
              </div>
            </div>
          </section>

          {/* Footer identique */}
          <footer className="px-8 pb-4">
            <hr className="border-t-2" style={{ borderColor: `${BLUE}99` }} />
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-black/60">
              <span>FoxyTable</span>
              <span>foxytable.com</span>
            </div>
          </footer>

          {/* Impression A4 */}
          <style>{`@media print{ @page{ size:A4 portrait; margin:0 } body{ -webkit-print-color-adjust:exact; print-color-adjust:exact } }`}</style>
        </main>
      </div>
    );
  }

  /* --- Par défaut : garde les templates existants --- */
  try {
    return <>{renderByTemplate(product)}</>;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return (
      <main className="min-h-[40vh] grid place-items-center p-6">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-5 border">
          <h2 className="text-lg font-semibold mb-2">Erreur pendant le rendu du template</h2>
          <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded border">{msg}</pre>
          <p className="text-xs opacity-70 mt-3">Vérifie l’import/export des templates et la forme des données.</p>
          <p className="mt-3"><Link to="/catalogue" className="underline">← Retour au catalogue</Link></p>
        </div>
      </main>
    );
  }
}
