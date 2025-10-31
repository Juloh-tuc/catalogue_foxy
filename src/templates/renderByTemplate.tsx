import React from "react";
import DefaultTemplate from "./specifics/DefaultTemplate";
import { CatalogSheet, type ProductRecord } from "./common";

/** Tweaks légers par slug */
const flagsBySlug: Record<
  string,
  { hideTopImage?: boolean; hideBottomImage?: boolean }
> = {
  // ex : cacher l’image haute pour ce produit
  "kits-couverts-bois-et-papier": { hideTopImage: true },
  // ajoute d’autres slugs si besoin
};

export function renderByTemplate(product: ProductRecord) {
  const slug = (product.slug || "").toLowerCase();
  const flags = flagsBySlug[slug] || {};

  return (
    <CatalogSheet>
      <DefaultTemplate
        product={product}
        hideTopImage={!!flags.hideTopImage}
        hideBottomImage={!!flags.hideBottomImage}
      />
    </CatalogSheet>
  );
}

export default renderByTemplate;
