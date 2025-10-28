// src/lib/loadProducts.ts
import raw from "../data/products.json";
import type { ProductRecord, SpecRow } from "../templates/ProductTemplates";

type RawVariant = {
  reference: string;
  libelle: string;
  format: string;
  matiere: string;
  cond?: string;         // sac / sachet
  carton?: string;       // carton
  palette?: string;      // palette (optionnel dans ton JSON)
  temperature?: string;
};

type RawProduct = {
  slug: string;
  name: string;
  category: string;
  image?: string;
  heroImage?: string;
  description?: string;
  template: string;
  badges?: string[];
  variants: RawVariant[];
};

function toSpecRows(variants: RawVariant[]): SpecRow[] {
  if (!Array.isArray(variants) || variants.length === 0) return [];
  return variants.map((v) => ({
    reference: v.reference ?? "",
    format: v.format ?? "",
    divers:
      (v.libelle ? v.libelle : "") +
      (v.matiere ? (v.libelle ? ` · ${v.matiere}` : v.matiere) : ""),
    sac: v.cond && v.cond !== "" ? v.cond : "-",
    carton: v.carton && v.carton !== "" ? v.carton : "-",
    palette: v.palette && v.palette !== "" ? v.palette : "-"
  }));
}

function normalizeTemplate(t?: string): ProductRecord["template"] {
  return t === "single" ? "single" : "double";
}

const PLACEHOLDER = "/images/placeholder.png";

export function getProducts(): ProductRecord[] {
  const arr = (raw as unknown) as RawProduct[];
  if (!Array.isArray(arr)) return [];

  return arr.map((p) => {
    const first = p.variants?.[0];
    const rec: ProductRecord = {
      slug: p.slug,
      title: p.name,
      subtitle: p.category,
      image: p.image ?? PLACEHOLDER,
      heroImage: p.heroImage,
      specs: toSpecRows(p.variants || []),
      template: normalizeTemplate(p.template),
      category: p.category,
      description: p.description,
      packaging: first?.temperature ? { temperature: first.temperature } : undefined,
      bottomNote: undefined,
      bottomBadge: undefined
    };
    return rec;
  });
}

export function getProductBySlug(slug: string): ProductRecord | undefined {
  return getProducts().find((p) => p.slug === slug);
}
