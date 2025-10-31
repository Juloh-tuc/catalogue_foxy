import { useLocation } from "react-router-dom";

export type TabItem = {
  key: string;
  label: string;
  color: string;
  targetIndex: number;
};

type Props = {
  items: TabItem[];
  activeKey?: string;
  onJump: (targetIndex: number) => void;
  /** Largeur d'une page A4 (px) */
  pageWidth?: number;  // défaut 794
  /** Espace entre les 2 pages (px) — le "gutter" vertical gris */
  gutter?: number;     // défaut 48
  /** Espace entre le bord droit de la page et le rail (px) */
  gap?: number;        // défaut 12
};

export default function TabRail({
  items,
  activeKey,
  onJump,
  pageWidth = 794,
  gutter = 48,
  gap = 12,
}: Props) {
  const { pathname } = useLocation();

  // visible UNIQUEMENT sur la vue catalogue
  if (!pathname.startsWith("/catalogue")) return null;

  // BORD DROIT de la page de droite = centre (50%) + gutter/2 + pageWidth
  // On ajoute 'gap' pour décoller légèrement le rail
  const leftExpr = `calc(50% + ${Math.round(gutter / 2)}px + ${pageWidth}px + ${gap}px)`;

  return (
    <nav
      data-tab-rail
      aria-label="Navigation par catégories"
      className="hidden lg:flex flex-col gap-2 fixed z-30"
      style={{ top: 24, left: leftExpr, width: 240 }}
    >
      {items.map((it) => {
        const active = it.key === activeKey;
        return (
          <button
            key={it.key}
            onClick={() => onJump(it.targetIndex)}
            className="text-left rounded-l-lg px-4 py-3 shadow-sm text-white font-bold tracking-wide uppercase transition-all hover:brightness-95 focus:outline-none"
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
