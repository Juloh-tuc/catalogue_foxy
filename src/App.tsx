import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Cover from "./pages/Cover";
import Catalogue from "./pages/Catalogue";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage"; // garde ton fichier existant

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
        <Link to="/" className="inline-block rounded-lg border border-[#17196c]/20 bg-white px-4 py-2 hover:shadow">
          ← Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* 🖼️ Page de garde avec le bouton "Accéder au catalogue" */}
        <Route path="/" element={<Cover />} />

        {/* 🏠 (optionnel) page Home en plus si tu veux une grille d’aperçus */}
        <Route path="/home" element={<Home />} />

        {/* 📖 Catalogue feuilletable */}
        <Route path="/catalogue" element={<Catalogue />} />

        {/* 🔍 Fiche produit par slug */}
        <Route path="/p/:slug" element={<ProductPage />} />

        {/* 🚫 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
