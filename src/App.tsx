import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";

// === Pages existantes (legacy) ===
import Cover from "./pages/Cover";
import Catalogue from "./pages/Catalogue";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";


/** Remonte en haut à chaque navigation */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

/** Page 404 */
function NotFound() {
  return (
    <main className="min-h-screen bg-[#fff8f0] text-[#17196c] grid place-items-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold mb-2">Oups… page introuvable</h1>
        <p className="opacity-70 mb-4">Le lien est peut-être erroné ou la page a été déplacée.</p>
        <Link
          to="/"
          className="inline-block rounded-lg border border-[#17196c]/20 bg-white px-4 py-2 hover:shadow"
        >
          ← Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}

/** Petit fallback pendant le lazy-loading */
function Loading() {
  return (
    <div className="min-h-[40vh] grid place-items-center text-[#17196c]">
      <div className="animate-pulse opacity-70">Chargement…</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* === Pages existantes === */}
          <Route path="/" element={<Cover />} />
          <Route path="/home" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/p/:slug" element={<ProductPage />} />

          
          {/* === 404 === */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
