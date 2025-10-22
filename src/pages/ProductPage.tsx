import { useParams, Link } from "react-router-dom";
import data from "../data/products.json";
import { renderByTemplate } from "../templates/ProductTemplates";
import type { ProductRecord } from "../templates/ProductTemplates";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  // sécurité: si pas de slug, on renvoie 404
  if (!slug) {
    return (
      <div className="min-h-screen bg-[#fff8f0] text-[#17196c] grid place-items-center p-6">
        <div className="text-center">
          <p className="text-2xl font-bold mb-3">Produit introuvable</p>
          <Link to="/" className="underline">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const products = data as ProductRecord[];
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fff8f0] text-[#17196c] grid place-items-center p-6">
        <div className="text-center">
          <p className="text-2xl font-bold mb-3">Produit introuvable</p>
          <Link to="/" className="underline">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  return <div className="bg-[#fff8f0] min-h-screen">{renderByTemplate(product)}</div>;
}
