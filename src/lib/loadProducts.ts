import raw from "../data/products.json";
import type { ProductRecord, SpecRow } from "../templates/ProductTemplates";

type RawVariant = {
  reference?: string;
  libelle?: string;
  format?: string;
  matiere?: string;
  cond?: string;     // sac / sachet
  carton?: string;   // carton
  palette?: string;  // palette (optionnel)
  temperature?: string;
};

type RawProduct = {
  slug?: string;
  name?: string;
  category?: string;
  image?: string;      // image du haut
  image2?: string;     // image du bas (si tu l'ajoutes plus tard)
  heroImage?: string;  // ignoré dans ProductRecord (optionnel)
  description?: string;
  template?: string;   // "single" | "double"
  badges?: string[];
  variants?: RawVariant[];
};

const PLACEHOLDER = "/images/placeholder.png";

function normalizeTemplate(t?: string): ProductRecord["template"] {
  return t === "single" || t === "double" ? t : "double";
}

function uniq(list: (string | undefined)[]) {
  return Array.from(new Set(list.filter(Boolean) as string[]));
}

/** Transforme les variantes en lignes {label, value} agrégées */
function toSpecRows(variants?: RawVariant[]): SpecRow[] {
  if (!variants || variants.length === 0) return [];

  const formats  = uniq(variants.map(v => v.format)).join(", ");
  const matieres = uniq(variants.map(v => v.matiere)).join(", ");
  const conds    = uniq(variants.map(v => v.cond)).join(", ");
  const cartons  = uniq(variants.map(v => v.carton)).join(", ");
  const palettes = uniq(variants.map(v => v.palette)).join(", ");

  const rows: SpecRow[] = [
    { label: "Références", value: `${variants.length} disponibles` },
  ];
  if (formats)  rows.push({ label: "Formats", value: formats });
  if (matieres) rows.push({ label: "Matière", value: matieres });
  if (conds)    rows.push({ label: "Conditionnement", value: conds });
  if (cartons)  rows.push({ label: "Carton", value: cartons });
  if (palettes) rows.push({ label: "Palette", value: palettes });

  return rows;
}

export function getProducts(): ProductRecord[] {
  // Le JSON peut être un tableau direct (comme chez toi)
  const arr: RawProduct[] = Array.isArray(raw)
    ? (raw as RawProduct[])
    : (Array.isArray((raw as any)?.products) ? (raw as any).products : []);

  if (!Array.isArray(arr)) return [];

  return arr.map((p): ProductRecord => ({
    slug: p.slug ?? "",
    title: p.name ?? "(Sans titre)",
    subtitle: p.category || undefined,
    image: p.image || PLACEHOLDER,
    bottomImage: p.image2 || undefined, // si tu ajoutes image2 plus tard
    specs: toSpecRows(p.variants),
    template: normalizeTemplate(p.template),
    bottomNote: p.description || undefined,
    bottomBadge: Array.isArray(p.badges) && p.badges[0] ? p.badges[0] : undefined,
  }));
}

export function getProductBySlug(slug: string): ProductRecord | undefined {
  return getProducts().find(p => p.slug === slug);
}
