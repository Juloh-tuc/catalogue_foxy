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

export default function Catalogue() {
  const products = useMemo(() => getProducts(), []);
  const pages = useMemo<Page[]>(
    () => [{ type: "toc" as const }, ...products.map((p) => ({ type: "product" as const, product: p }))],
    [products]
  );

  const [spread, setSpread] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setSpread(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const [i, setI] = useState(0);
  const step = spread ? 2 : 1;
  const maxIndex = spread ? Math.max(0, pages.length - 2) : pages.length - 1;

  const prev = useCallback(() => setI((v) => Math.max(0, v - step)), [step]);
  const next = useCallback(() => setI((v) => Math.min(maxIndex, v + step)), [maxIndex, step]);

  useEffect(() => {
    setI((v) => Math.min(v, maxIndex));
  }, [maxIndex]);

  // navigation clavier
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
  const onTouchStart = (e: React.TouchEvent) =>
    (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  const left = pages[i];
  const right = spread ? pages[i + 1] : undefined;

  return (
    <main
      className="min-h-screen flex flex-col items-center gap-4 p-4"
      style={{ background: "#ffffff", color: FOXY_COLORS.bleu }}
    >
      {/* Barre de navigation — bouton “Sommaire” supprimé */}
      <div
        className="sticky top-0 z-10 rounded-full px-2 py-1 flex items-center gap-3"
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

      {/* Feuilles */}
      <div
        className={`w-full max-w-[2200px] grid ${spread ? "md:grid-cols-2" : "grid-cols-1"} gap-4 items-start`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <PageRenderer page={left} products={products} />
        {spread
          ? right
            ? <PageRenderer page={right} products={products} />
            : <BlankSheet />
          : null}
      </div>
    </main>
  );
}

function PageRenderer({ page, products }: { page: Page; products: ProductRecord[] }) {
  if (page.type === "toc") return <Toc products={products} />;
  return (
    <div className="transition-transform duration-200">
      {renderByTemplate(page.product)}
    </div>
  );
}
