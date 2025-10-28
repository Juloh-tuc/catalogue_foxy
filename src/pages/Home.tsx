import { Link } from "react-router-dom";
import data from "../data/products.json";

export default function Home() {
  const products = data as any[];

  return (
    <main className="bg-[#fff8f0] min-h-screen text-[#17196c] p-6 md:p-10">
      {/* 🦊 Bandeau principal */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Catalogue FoxyTable</h1>
          <div className="h-1 w-24 bg-[#e5813e] rounded-full mt-2" />
          <p className="mt-3 opacity-80 max-w-md">
            Découvrez nos gammes écologiques et élégantes : couverts, pailles, boîtes et accessoires alimentaires.
          </p>
        </div>

        {/* 📖 Bouton vers la version catalogue */}
        <Link
          to="/catalogue"
          className="inline-block rounded-lg border border-[#17196c]/20 bg-white px-5 py-2 font-semibold hover:shadow transition"
        >
          📘 Feuilleter le catalogue complet
        </Link>
      </header>

      {/* 🧩 Grille des produits */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <Link
            key={p.slug}
            to={`/p/${p.slug}`}
            className="bg-white rounded-2xl border border-[#17196c]/10 overflow-hidden hover:shadow-lg transition"
          >
            {/* Image produit */}
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                className="w-full aspect-[4/3] object-cover"
              />
            )}

            {/* Détails */}
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide opacity-60">{p.category}</p>
              <h2 className="font-semibold text-base mt-1">{p.name}</h2>
              {p.description && (
                <p className="text-sm opacity-70 mt-1 line-clamp-2">{p.description}</p>
              )}
            </div>
          </Link>
        ))}
      </section>

      {/* Footer doux */}
      <footer className="mt-12 text-center text-sm opacity-70">
        © 2026 FoxyTable — Design & Développement by Julie 🦊
      </footer>
    </main>
  );
}
