// src/pages/Catalogue.tsx
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  renderByTemplate,
  type ProductRecord,
  FOXY_COLORS,
  CatalogSheet,
} from "../templates/ProductTemplates";
import Toc from "./Toc";
import { getProducts } from "../lib/loadProducts";
import PageBadge from "../components/PageBadge";

/** pages possibles */
type Page =
  | { type: "toc" }
  | { type: "product"; product: ProductRecord };

function BlankSheet() {
  return (
    <CatalogSheet>
      <div className="row-start-1 row-end-5 grid place-items-center">
        <span className="text-xs opacity-40">— page vide —</span>
      </div>
    </CatalogSheet>
  );
}

/** Palette */
const CAT_COLORS: Record<string, string> = {
  "Nos incontournables": "#174A45",
  "Vente à emporter": "#EAA76C",
  "Boulangerie / Pâtisserie": "#DD825B",
  "Boucherie Charcuterie Fromagerie": "#E06E99",
  "Poissonnerie": "#49A8C8",
  "Fruits & Légumes": "#42B471",
  "Traiteur / Laboratoire": "#B8BBC0",
  "Entretien & Hygiène": "#76A7D8",
  "Sortie de caisse": "#C85B47",
  "Services généraux": "#6B7E97",
  "Grand public": "#5F67AB",
  "Couverts": "#fbbf24",
  "Boissons": "#14b8a6",
  "Vente à emporter / XPS": "#EAA76C",
};

/** Réglages rail (modifiable facilement) */
const RAIL_WIDTH_PX = 200;         // largeur colonne d’onglets (ex: 190–210)
const RAIL_GAP_PX = 10;            // écart vertical entre onglets
const RAIL_OUTSIDE_OFFSET_PX = 6;  // distance du rail par rapport au bord (extérieur)

/** Hauteur des onglets (visuel marque-page) */
const TAB_HEIGHT_PX = 68;          // ex: 64 / 72

export default function Catalogue() {
  const products = useMemo(() => getProducts(), []);
  const pages = useMemo<Page[]>(
    () => [{ type: "toc" as const }, ...products.map((p) => ({ type: "product" as const, product: p }))],
    [products]
  );

  /** double-page si viewport >= lg */
  const [spread, setSpread] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setSpread(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /** index de la page gauche (si double) */
  const [i, setI] = useState(0);
  const step = spread ? 2 : 1;
  const maxIndex = spread ? Math.max(0, pages.length - 2) : pages.length - 1;

  const prev = useCallback(() => setI((v) => Math.max(0, v - step)), [step]);
  const next = useCallback(() => setI((v) => Math.min(maxIndex, v + step)), [maxIndex, step]);

  useEffect(() => { setI((v) => Math.min(v, maxIndex)); }, [maxIndex]);

  // clavier
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // swipe mobile
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  /** Index de la première page de chaque catégorie */
  const catFirstIndex = useMemo(() => {
    const map = new Map<string, number>();
    pages.forEach((pg, idx) => {
      if (pg.type === "product") {
        const cat = pg.product.category?.trim() || "Autres";
        if (!map.has(cat)) map.set(cat, idx);
      }
    });
    return map;
  }, [pages]);

  const orderedCats = useMemo(() => {
    const pref = [
      "Nos incontournables",
      "Vente à emporter",
      "Boulangerie / Pâtisserie",
      "Boucherie Charcuterie Fromagerie",
      "Poissonnerie",
      "Fruits & Légumes",
      "Traiteur / Laboratoire",
      "Entretien & Hygiène",
      "Sortie de caisse",
      "Services généraux",
      "Grand public",
      "Couverts",
      "Boissons",
    ];
    const present = Array.from(catFirstIndex.keys());
    const picked = pref.filter((c) => present.includes(c));
    const rest = present.filter((c) => !picked.includes(c));
    return [...picked, ...rest];
  }, [catFirstIndex]);

  const tabs = useMemo(
    () =>
      orderedCats.map((c) => ({
        key: c,
        label: c.toUpperCase(),
        color: CAT_COLORS[c] || FOXY_COLORS.orange,
        targetIndex: catFirstIndex.get(c)!,
      })),
    [orderedCats, catFirstIndex]
  );

  const currentKey = useMemo(() => {
    const leftPg = pages[i];
    const rightPg = pages[i + 1];
    const pg =
      leftPg?.type === "product"
        ? leftPg
        : rightPg?.type === "product"
        ? rightPg
        : undefined;
    return pg?.product?.category;
  }, [pages, i]);

  const jumpTo = useCallback(
    (targetIndex: number) => {
      if (!spread) {
        setI(targetIndex);
        return;
      }
      const left = targetIndex % 2 === 0 ? targetIndex : targetIndex - 1;
      setI(Math.max(0, left));
    },
    [spread]
  );

  const left = pages[i];
  const right = spread ? pages[i + 1] : undefined;

  return (
    <main
      className="min-h-screen flex flex-col items-center gap-4 p-4"
      style={{ background: "#ffffff", color: FOXY_COLORS.bleu }}
    >
      {/* Contrôles */}
      <div
        className="sticky top-0 z-30 rounded-full px-2 py-1 flex items-center gap-3"
        style={{ background: `#ffffffCC`, backdropFilter: "blur(6px)" }}
      >
        <Link
          to="/"
          className="px-3 py-2 rounded-lg border bg-white hover:shadow"
          style={{ borderColor: `${FOXY_COLORS.bleu}26`, color: FOXY_COLORS.bleu }}
        >
          Couverture
        </Link>

        <button
          onClick={prev}
          className="px-3 py-2 rounded-lg border bg-white hover:shadow disabled:opacity-40"
          style={{ borderColor: `${FOXY_COLORS.bleu}26` }}
          disabled={i === 0}
        >
          ← Précédent
        </button>

        <span className="text-sm opacity-70">
          Page {spread ? `${i + 1}-${Math.min(i + 2, pages.length)}` : i + 1} / {pages.length}
        </span>

        <button
          onClick={next}
          className="px-3 py-2 rounded-lg border bg-white hover:shadow disabled:opacity-40"
          style={{ borderColor: `${FOXY_COLORS.bleu}26` }}
          disabled={i >= maxIndex}
        >
          Suivant →
        </button>
      </div>

      {/* === CONTENEUR DU CATALOGUE — ancre relative et largeur fixe === */}
      <div className="relative w-[1500px] max-w-full bg-white shadow-xl rounded-2xl overflow-visible">
        {/* Feuilles (1 ou 2 colonnes) */}
        <div
          className={`grid ${spread ? "lg:grid-cols-2" : "grid-cols-1"} gap-4 items-start p-8`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <PageRenderer page={left} pages={pages} />
          {spread ? (right ? <PageRenderer page={right} pages={pages} /> : <BlankSheet />) : null}
        </div>

        {/* === RAIL EXTÉRIEUR TYPE PUBLIEMBAL === */}
        <div
          className="hidden lg:block absolute inset-y-0 right-0 z-30"
          // ancre au bord droit, puis décale le rail totalement à l'extérieur
          style={{
            width: RAIL_WIDTH_PX,
            transform: `translateX(${RAIL_WIDTH_PX + RAIL_OUTSIDE_OFFSET_PX}px)`,
          }}
        >
          {/* tranche (spine) côté page */}
          <div className="absolute left-0 top-0 h-full w-[6px] bg-black/10" />

          {/* pile d’onglets pleine hauteur */}
          <nav
            aria-label="Navigation catégories"
            className="h-full flex flex-col"
            style={{ rowGap: `${RAIL_GAP_PX}px` }}
          >
            {tabs.map((tab) => {
              const active = tab.key === currentKey;
              return (
                <button
                  key={tab.key}
                  onClick={() => jumpTo(tab.targetIndex)}
                  className={[
                    "w-full",
                    `h-[${TAB_HEIGHT_PX}px]`,
                    "px-4 text-white text-[13px] font-bold text-left",
                    // droit côté page (gauche), arrondi à l’extérieur (droite)
                    "rounded-l-none rounded-r-2xl",
                    "shadow-md hover:brightness-105 transition",
                    active ? "ring-2 ring-white" : "",
                  ].join(" ")}
                  style={{
                    backgroundColor: tab.color,
                    display: "flex",
                    alignItems: "center",
                    borderLeft: "4px solid rgba(0,0,0,0.06)", // trait discret côté page
                  }}
                  title={tab.key}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Variante mobile : rubans sous le catalogue */}
        <div className="lg:hidden border-t border-slate-200/60 p-3 flex gap-2 flex-wrap">
          {tabs.map((tab) => {
            const active = tab.key === currentKey;
            return (
              <button
                key={tab.key}
                onClick={() => jumpTo(tab.targetIndex)}
                className={[
                  "rounded-full px-3 py-2 text-xs font-semibold text-white",
                  active ? "ring-2 ring-black/10" : "",
                ].join(" ")}
                style={{ backgroundColor: tab.color }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

/** Rendu d’une feuille + pastille catégorie (overlay dans le coin) */
function PageRenderer({ page, pages }: { page: Page; pages: Page[] }) {
  if (page.type === "toc")
    return (
      <Toc
        products={pages
          .filter((p): p is { type: "product"; product: ProductRecord } => p.type === "product")
          .map((p) => p.product)}
      />
    );

  const cat = page.product.category || "";
  const color = CAT_COLORS[cat] || FOXY_COLORS.orange;

  return (
    <div className="relative transition-transform duration-200">
      <PageBadge label={cat} color={color} />
      {renderByTemplate(page.product)}
    </div>
  );
}
