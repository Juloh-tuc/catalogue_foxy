// src/pages/Toc.tsx
import { memo } from "react";

const BLUE = "#17196C";
const ORANGE = "#E5813E";

function TocImpl() {
  // ⚠️ Garde les libellés EXACTS utilisés dans tes produits (subtitle)
  const items = [
    { label: "Nos incontournables",    pages: "Page 3",     dot: ORANGE },
    { label: "Vente à emporter",       pages: "Page 4 - 5", dot: "#F59E0B" },
    { label: "Bar / Brasserie",        pages: "Page 6 - 7", dot: "#22C55E" },
    { label: "Traiteur / Laboratoire", pages: "Page 8 - 9", dot: "#3B82F6" },
    { label: "Couverts",               pages: "Page 10 - 11", dot: "#EF4444" },
    { label: "Gobelets / accessoires", pages: "Page 12 - 13", dot: "#8B5CF6" },
  ];

  return (
    <div className="w-full">
      {/* Bandeau image — hauteur fixe pour une vraie “tête de page” */}
      <div className="rounded-xl overflow-hidden" style={{ height: 460 }}>
        <img
          src="/images/page_table_matier.png"
          alt="Ambiance FoxyTable"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 60%" }}
        />
      </div>

      {/* Contenu */}
      <section className="px-6 md:px-10 pt-8 pb-2">
        <h1
          className="font-extrabold leading-[1.05] m-0"
          style={{ fontSize: 56, color: BLUE }}
        >
          Table des
          <br />
          matières
        </h1>

        {/* Ligne orange sous le titre */}
        <div
          className="mt-3 rounded-full"
          style={{ height: 6, width: 460, maxWidth: "78%", background: ORANGE }}
        />

        {/* Liste 2 colonnes */}
        <ol className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-3">
          {items.map((it) => (
            <li key={it.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-block w-3.5 h-3.5 rounded-full"
                  style={{ background: it.dot }}
                />
                <span className="font-semibold" style={{ color: BLUE }}>
                  {it.label}
                </span>
              </div>
              <span className="text-sm opacity-70">{it.pages}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default memo(TocImpl);
