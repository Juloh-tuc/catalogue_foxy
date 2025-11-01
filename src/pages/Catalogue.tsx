// src/pages/Catalogue.tsx
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { renderByTemplate, type ProductRecord } from "../templates/ProductTemplates";
import Toc from "./Toc";
import { getProducts } from "../lib/loadProducts";
import PageBadge from "../components/PageBadge";

/** Couleurs FoxyTable */
const FOXY_COLORS = {
  bleu: "#17196c",
  orange: "#e5813e",
  cream: "#fff8f0",
} as const;

/** Dimensions A4 @96dpi */
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

/** Espacements / rail externe */
const GRID_GAP_PX = 24;              // gap-6
const RAIL_WIDTH_PX = 200;           // largeur du rail
const RAIL_GAP_PX = 10;
const RAIL_OUTSIDE_OFFSET_PX = -10;  // décalage vers l’extérieur (tu as mis -10)
const TAB_HEIGHT_PX = 68;

/** Types de page */
type Page =
  | { type: "toc" }
  | { type: "product"; product: ProductRecord };

/** Couleurs par catégorie (on harmonisera plus tard) */
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

/** Feuille A4 : fond crème + footer */
function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-catalog-sheet
      className="relative rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-xl flex flex-col"
      style={{ width: A4_WIDTH, minHeight: A4_HEIGHT, background: FOXY_COLORS.cream }}
    >
      <div className="flex-1 p-5 lg:p-6">{children}</div>
      <div className="px-5 lg:px-6 pb-4">
        <hr className="border-t-2" style={{ borderColor: `${FOXY_COLORS.bleu}99` }} />
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-black/60">
          <span>FoxyTable</span>
          <span>foxytable.com</span>
        </div>
      </div>
    </div>
  );
}

/** Rendu produit protégé */
function SafeProduct({ product }: { product: ProductRecord }) {
  try {
    return <>{renderByTemplate(product)}</>;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return (
      <div className="p-4 rounded-xl border bg-red-50 text-red-700">
        <div className="font-semibold mb-1">Erreur de rendu produit</div>
        <pre className="text-xs whitespace-pre-wrap">{msg}</pre>
      </div>
    );
  }
}

export default function Catalogue() {
  // Produits
  const products = useMemo<ProductRecord[]>(() => {
    try {
      const p = getProducts();
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }, []);

  // Pages : ToC + produits
  const pages = useMemo<Page[]>(
    () => [{ type: "toc" as const }, ...products.map((p) => ({ type: "product" as const, product: p }))],
    [products]
  );

  // Double page si >= 1024px
  const [spread, setSpread] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setSpread(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pagination
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

  // 1er index par catégorie
  const catFirstIndex = useMemo(() => {
    const map = new Map<string, number>();
    pages.forEach((pg, idx) => {
      if (pg.type === "product") {
        const key = (pg.product.subtitle || "Autres").trim();
        if (!map.has(key)) map.set(key, idx);
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
        targetIndex: catFirstIndex.get(c) ?? 0,
      })),
    [orderedCats, catFirstIndex]
  );

  const currentKey = useMemo(() => {
    const leftPg = pages[i];
    const rightPg = pages[i + 1];
    const pg =
      leftPg?.type === "product" ? leftPg :
      rightPg?.type === "product" ? rightPg :
      undefined;
    return pg?.product?.subtitle || "Autres";
  }, [pages, i]);

  const jumpTo = useCallback(
    (targetIndex: number) => {
      if (!spread) setI(targetIndex);
      else {
        const left = targetIndex % 2 === 0 ? targetIndex : targetIndex - 1;
        setI(Math.max(0, left));
      }
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

      {/* Double-page */}
      <div
        className="relative w-full mx-auto"
        style={{
          // réserve l'espace du rail à droite
          paddingRight: RAIL_WIDTH_PX + RAIL_OUTSIDE_OFFSET_PX + 12,
          // largeur maxi = pages + gap + rail (réservé) + marge
          maxWidth: spread
            ? (A4_WIDTH * 2 + GRID_GAP_PX + RAIL_WIDTH_PX + RAIL_OUTSIDE_OFFSET_PX + 32)
            : (A4_WIDTH + RAIL_WIDTH_PX + RAIL_OUTSIDE_OFFSET_PX + 32),
        }}
      >
        <div
          className={`grid ${spread ? "lg:grid-cols-2" : "grid-cols-1"} gap-6 items-start`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <PageRenderer page={left} />
          {spread ? (right ? <PageRenderer page={right} /> : <BlankSheetInFrame />) : null}
        </div>

        {/* Rail externe (desktop) */}
        <div
          className="hidden lg:block absolute inset-y-0 right-0 z-30"
          style={{
            width: RAIL_WIDTH_PX,
            transform: `translateX(${RAIL_OUTSIDE_OFFSET_PX}px)`,
          }}
        >
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
                    "w-full px-4 text-white text-[13px] font-bold text-left",
                    "rounded-l-none rounded-r-2xl",
                    "shadow-md hover:brightness-105 transition",
                    active ? "ring-2 ring-white" : "",
                  ].join(" ")}
                  style={{
                    backgroundColor: tab.color,
                    display: "flex",
                    alignItems: "center",
                    borderLeft: "4px solid rgba(0,0,0,0.06)",
                    height: TAB_HEIGHT_PX,
                  }}
                  title={tab.key}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pills mobile */}
        <div className="lg:hidden mt-4 border-t border-slate-200/60 p-3 flex gap-2 flex-wrap">
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

/** Page vide (droite impaire) */
function BlankSheetInFrame() {
  return (
    <PageFrame>
      <div className="min-h-[580px] grid place-items-center">
        <span className="text-xs opacity-40">— page vide —</span>
      </div>
    </PageFrame>
  );
}

/** Rendu d’une page */
function PageRenderer({ page }: { page: Page | undefined }) {
  if (!page) return <BlankSheetInFrame />;

  if (page.type === "toc") {
    return (
      <PageFrame>
        <Toc />
      </PageFrame>
    );
  }

  const cat = page.product.subtitle || "";
  const color = CAT_COLORS[cat] || FOXY_COLORS.orange;

  return (
    <PageFrame>
      <div className="relative">
        <PageBadge label={cat} color={color} />
        <div className="rounded-2xl overflow-hidden pb-2">
          <SafeProduct product={page.product} />
        </div>
      </div>
    </PageFrame>
  );
}
