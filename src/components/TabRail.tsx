import React from "react";

export type TabItem = {
  key: string;        // identifiant: "Couverts"
  label: string;      // affichage: "COUVERTS"
  color: string;      // ex "#e5813e"
  targetIndex: number;// index dans le tableau 'pages' du Catalogue (première page de la catégorie)
};

type Props = {
  items: TabItem[];
  activeKey?: string;
  onJump: (targetIndex: number) => void;
};

/**
 * Onglets verticaux style PubliEmbal.
 * - Affichés à DROITE, fixed, masqués sur mobile.
 * - L’onglet actif est plus large et a un léger soulignement.
 */
export default function TabRail({ items, activeKey, onJump }: Props) {
  return (
    <nav
      aria-label="Navigation par catégories"
      className="hidden lg:flex flex-col gap-1 fixed right-3 top-6 z-30"
      style={{ width: 240 }}
    >
      {items.map((it) => {
        const active = it.key === activeKey;
        return (
          <button
            key={it.key}
            onClick={() => onJump(it.targetIndex)}
            className={[
              "text-left rounded-l-lg px-4 py-3 shadow-sm text-white font-bold tracking-wide uppercase",
              "transition-all hover:brightness-95 focus:outline-none"
            ].join(" ")}
            style={{
              background: it.color,
              width: active ? 240 : 220,
              borderRight: "6px solid rgba(0,0,0,0.06)",
            }}
          >
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}
