// src/templates/ProductTemplates.tsx
import React from "react";
import ProductPanel from "../components/ProductPanel";

/** === TYPES === */
export type SpecRow = { label: string; value: string };

export type ProductRecord = {
  slug: string;
  title: string;
  subtitle?: string;
  image?: string;         // image du haut
  bottomImage?: string;   // image du bas (optionnel)
  specs: SpecRow[];       // lignes libellé/valeur
  template: "single" | "double";
  bottomNote?: string;
  bottomBadge?: string;
};

/** Filtre et normalise les specs (évite les lignes vides) */
function sanitizeSpecs(rows: SpecRow[] | undefined | null): SpecRow[] {
  if (!rows?.length) return [];
  return rows
    .filter(r => Boolean(r?.label) && Boolean(r?.value))
    .map(r => ({ label: String(r.label).trim(), value: String(r.value).trim() }))
    .filter(r => r.label.length > 0 && r.value.length > 0);
}

/** Tableau simple et lisible (100% Tailwind, pas de min-h) */
function SpecsTable({ rows }: { rows: SpecRow[] }) {
  const clean = sanitizeSpecs(rows);
  if (!clean.length) {
    return (
      <div className="p-3 text-sm text-[#17196c]/70">
        Aucune spécification disponible pour ce produit.
      </div>
    );
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

/** Petit encart neutre (pas de hauteur forcée) */
function SoftCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 border border-[#17196c]/10">
      {children}
    </div>
  );
}

/**
 * === Rendu par template ===
 * IMPORTANT :
 * - ❌ plus de <main> ici, pas de min-h-screen, pas de max-w géant
 * - ✅ on renvoie des blocs qui respectent la largeur du parent (la feuille A4)
 * - ✅ aucune classe qui force la hauteur (les images ne doivent PAS être h-full)
 */
export function renderByTemplate(p: ProductRecord) {
  const panel = (
    <ProductPanel
      title={p.title}
      subtitle={p.subtitle}
      topImg={p.image}
      bottomImg={p.bottomImage}
      bottomNote={p.bottomNote}
      bottomBadge={p.bottomBadge}
    >
      <SpecsTable rows={p.specs} />
    </ProductPanel>
  );

  if (p.template === "double") {
    return (
      <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-2">
        {panel}

        {/* Colonne droite libre : configurable */}
        <SoftCard>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-[#17196c]">Informations</h3>
            <p className="text-sm text-[#17196c]/80">
              Ajoute ici un encart (produits associés, logos clients, note commerciale, etc.).
            </p>
          </div>
        </SoftCard>
      </div>
    );
  }

  // Template "single" : on centre un panneau, sans max-w agressif
  return (
    <div className="w-full">
      {panel}
    </div>
  );
}
