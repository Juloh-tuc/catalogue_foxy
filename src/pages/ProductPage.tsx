// src/pages/ProductPage.tsx
import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import data from "../data/products.json";
import { renderByTemplate } from "../templates/ProductTemplates";
import type { ProductRecord, SpecRow } from "../templates/ProductTemplates";

/** 1) Types "bruts" ultra souples, pour ne pas crasher */
type VariantRow = {
  reference?: string;
  libelle?: string;
  format?: string;
  matiere?: string;
  cond?: string;
  carton?: string;
};
type RawProduct = {
  slug?: string;
  name?: string;
  category?: string;
  image?: string;
  description?: string;
  template?: string;
  badges?: string[];
  variants?: VariantRow[];
};

/** 2) On récupère un tableau de produits quelle que soit la forme du JSON */
function getRawArray(x: unknown): RawProduct[] {
  if (Array.isArray(x)) return x as RawProduct[];
  if (x && typeof x === "object") {
    const o = x as any;
    if (Array.isArray(o.products)) return o.products as RawProduct[];
    if (Array.isArray(o.items)) return o.items as RawProduct[];
  }
  return [];
}

/** 3) Conversion minimale vers ProductRecord (zéro crash) */
function normalizeTemplate(t?: string): ProductRecord["template"] {
  return t === "single" || t === "double" ? t : "double";
}
function toSpecs(variants?: VariantRow[]): SpecRow[] {
  if (!variants || variants.length === 0) return [];
  const uniq = (arr: (string | undefined)[]) =>
    Array.from(new Set(arr.filter(Boolean) as string[]));
  const formats = uniq(variants.map(v => v.format)).join(", ");
  const matieres = uniq(variants.map(v => v.matiere)).join(", ");
  const conds = uniq(variants.map(v => v.cond)).join(", ");
  const cartons = uniq(variants.map(v => v.carton)).join(", ");
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
    image: raw.image ?? "",
    specs: toSpecs(raw.variants),
    template: normalizeTemplate(raw.template),
    bottomNote: raw.description || undefined,
    bottomBadge: Array.isArray(raw.badges) && raw.badges[0] ? raw.badges[0] : undefined,
  };
}

/** 4) Page ultra-sûre : en-tête diagnostic + rendu template dans un try/catch */
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/404" replace />;

  const raw = getRawArray(data as unknown);
  const count = raw.length;

  // Diagnostic minimal en haut de page (jamais “tout blanc”)
  const Diagnostic = (
    <div style={{ background: "#fff8f0", color: "#17196c", padding: 12 }}>
      <div style={{ fontWeight: 600 }}>Diagnostic</div>
      <div>Slug: <code>{slug}</code></div>
      <div>products.json → {Array.isArray(data) ? `Array(${(data as any[]).length})` : (data && typeof data === "object") ? "Object" : typeof data}</div>
      <div>Interprétation → {`Array(${count})`}</div>
      {count > 0 && (
        <div>Clés 1er item: <code>{Object.keys(raw[0] ?? {}).join(", ") || "(aucune)"}</code></div>
      )}
      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
        Si erreur en dessous, elle s’affiche en clair.
      </div>
    </div>
  );

  if (count === 0) {
    return (
      <>
        {Diagnostic}
        <main className="min-h-screen grid place-items-center p-6">
          <div className="text-center max-w-md">
            <p className="text-2xl font-bold mb-2">Aucun produit chargé</p>
            <p className="opacity-80 mb-4 text-sm">
              Vérifie la structure de <code>/data/products.json</code> (tableau ou clé <code>products</code>).
            </p>
            <Link to="/catalogue" className="underline">Retour au catalogue</Link>
          </div>
        </main>
      </>
    );
  }

  // Adaptation + lookup produit
  let product: ProductRecord | undefined;
  try {
    const normalized = raw.map(toRecord);
    product = normalized.find(p => p.slug === slug);
  } catch (e) {
    return (
      <>
        {Diagnostic}
        <ErrorBox title="Erreur pendant l’adaptation des données" error={e} />
      </>
    );
  }

  if (!product) {
    return (
      <>
        {Diagnostic}
        <main className="min-h-screen grid place-items-center p-6">
          <div className="text-center">
            <p className="text-2xl font-bold mb-3">Produit introuvable</p>
            <Link to="/catalogue" className="underline">Retour au catalogue</Link>
          </div>
        </main>
      </>
    );
  }

  // Rendu du template sous try/catch
  try {
    return (
      <>
        {Diagnostic}
        {renderByTemplate(product)}
      </>
    );
  } catch (e) {
    return (
      <>
        {Diagnostic}
        <ErrorBox title="Erreur pendant le rendu du template" error={e} />
      </>
    );
  }
}

/** Petit composant d’erreur lisible */
function ErrorBox({ title, error }: { title: string; error: unknown }) {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    <main className="min-h-[40vh] grid place-items-center p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow p-5 border">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded border">{msg}</pre>
        <p className="text-xs opacity-70 mt-3">
          Vérifie l’import/export des templates et la forme des données.
        </p>
      </div>
    </main>
  );
}
