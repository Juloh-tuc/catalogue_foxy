// src/pages/Toc.tsx
import { memo } from "react";
import type { ProductRecord } from "../templates/ProductTemplates";
import { FOXY_COLORS, CatalogSheet } from "../templates/ProductTemplates";

type Props = { products: ProductRecord[] };

function TocImpl(_props: Props) {
  const sections: Array<{ label: string; color: string; pages: string }> = [
    { label: "Nos incontournables",     color: "#e5813e", pages: "Page 3" },
    { label: "Vente à emporter",        color: "#f59e0b", pages: "Page 4 - 5" },
    { label: "Bar / Brasserie",         color: "#22c55e", pages: "Page 4 - 5" },
    { label: "Traiteur Laboratoire",    color: "#3b82f6", pages: "Page 4 - 5" },
    { label: "Couverts",                color: "#ef4444", pages: "Page 4 - 5" },
    { label: "Gobelets / accessoires",  color: "#8b5cf6", pages: "Page 4 - 5" },
  ];

  return (
    <CatalogSheet>
      {/* PHOTO — 2 rangées, moins de crop bas grâce à object-position */}
      <div className="row-start-1 row-end-3 rounded-xl overflow-hidden border border-[#191970]/40 bg-white">
        <img
          src="/images/page_table_matier.png"
          alt="Ambiance FoxyTable — Table des matières"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 62%" }} // ← descends la fenêtre (montre plus le bas). Ajuste 58–70% si besoin.
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* RANGÉE 3 : Titre + Sommaire empilés avec petit gap */}
      <section className="row-start-3 row-end-4 flex flex-col items-stretch gap-3 md:gap-4">
        {/* Titre */}
        <header className="text-center px-2">
          <h1
            className="font-maeven font-extrabold leading-tight m-0"
            style={{ fontSize: "clamp(34px, 5vw, 56px)", color: FOXY_COLORS.bleu }}
          >
            Table des
            <br />
            matières
          </h1>
          <div
            className="h-[6px] rounded-full mx-auto mt-3"
            style={{ width: "min(460px, 78%)", background: FOXY_COLORS.orange }}
          />
        </header>

        {/* Sommaire — gap réduit avec mt faible */}
        <div className="px-2 mt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-x-10 md:gap-x-14">
            {sections.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-block w-3.5 h-3.5 rounded-full"
                    style={{ background: s.color }}
                  />
                  <span
                    className="font-roboto font-semibold"
                    style={{ color: FOXY_COLORS.bleu }}
                  >
                    {s.label}
                  </span>
                </div>
                <span className="text-sm opacity-70">{s.pages}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RANGÉE 4 vide (pied de page géré par CatalogSheet) */}
      <div className="row-start-4 row-end-5" />
    </CatalogSheet>
  );
}

export default memo(TocImpl);
