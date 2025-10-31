import { useLocation } from "react-router-dom";

export type SideItem = {
  key: string;
  label: string;
  color?: string;
  targetIndex: number;
};

type Props = {
  items: SideItem[];
  currentKey?: string;
  onJump: (targetIndex: number) => void;
  pageWidth?: number; // défaut 794
  gutter?: number;    // défaut 48
  gap?: number;       // défaut 12
};

const FOXY_COLORS = { bleu: "#17196c", orange: "#e5813e" } as const;

export default function SideNav({
  items,
  currentKey,
  onJump,
  pageWidth = 794,
  gutter = 48,
  gap = 12,
}: Props) {
  const { pathname } = useLocation();

  // visible UNIQUEMENT sur /catalogue
  if (!pathname.startsWith("/catalogue")) return null;

  // même calcul que TabRail : se placer APRES le bord droit de la page droite
  const leftExpr = `calc(50% + ${Math.round(gutter / 2)}px + ${pageWidth}px + ${gap}px)`;

  return (
    <aside
      data-sidenav
      className="hidden md:flex flex-col gap-2 fixed z-10"
      aria-label="Navigation des catégories"
      style={{ top: 80, left: leftExpr, width: 220 }}
    >
      {items.map((it) => {
        const active = it.key === currentKey;
        return (
          <button
            key={it.key}
            onClick={() => onJump(it.targetIndex)}
            className={[
              "text-left w-full rounded-lg px-3 py-2 border transition",
              "hover:shadow",
              active ? "bg-white" : "bg-[#fff8f0]",
            ].join(" ")}
            style={{ borderColor: `${FOXY_COLORS.bleu}26`, color: FOXY_COLORS.bleu }}
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: it.color || FOXY_COLORS.orange }}
              />
              <span className="font-semibold text-sm">{it.label}</span>
            </span>
          </button>
        );
      })}
    </aside>
  );
}
