import React from "react";

export type Variant = { 
  reference: string; 
  libelle: string; 
  format?: string; 
  matiere?: string; 
  cond?: string; 
  carton?: string 
};

export type ProductRecord = {
  slug: string;
  name: string;
  category?: string;
  image?: string;
  description?: string;
  template: "simple" | "double" | "hero";
  specs?: Record<string, string>;
  bullets?: string[];
  variants?: Variant[];
};

// -------------------
// Structure de base
// -------------------
const Page: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <section
    className={`mx-auto my-6 w-full max-w-[900px] bg-[#fff8f0] text-[#17196c] p-6 md:p-10 ${
      className || ""
    }`}
  >
    {children}
  </section>
);

const Divider = ({ className = "" }) => (
  <div className={`h-[3px] w-28 rounded-full bg-[#e5813e] ${className}`} />
);

// -------------------
// Template simple
// -------------------
export const SimpleTemplate: React.FC<{ p: ProductRecord }> = ({ p }) => (
  <Page>
    <h1 className="text-3xl md:text-4xl font-extrabold">{p.name}</h1>
    <Divider className="my-3" />
    <div className="grid md:grid-cols-2 gap-6">
      {p.image && (
        <img
          src={p.image}
          alt={p.name}
          className="rounded-xl border border-[#17196c]/10 object-cover w-full"
        />
      )}
      <div className="space-y-3 text-sm leading-relaxed">
        {p.description && <p>{p.description}</p>}
        {p.specs && (
          <table className="min-w-full text-sm border border-[#17196c]/10 rounded-lg overflow-hidden bg-white">
            <tbody>
              {Object.entries(p.specs).map(([k, v]) => (
                <tr key={k} className="odd:bg-[#17196c]/[0.03]">
                  <td className="px-3 py-2 font-semibold capitalize">{k}</td>
                  <td className="px-3 py-2">{v || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </Page>
);

// -------------------
// Template double
// -------------------
export const DoubleTemplate: React.FC<{ p: ProductRecord }> = ({ p }) => (
  <Page>
    <h1 className="text-3xl md:text-4xl font-extrabold">{p.name}</h1>
    <Divider className="my-3" />
    {p.description && <p className="mb-4">{p.description}</p>}
    <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
      <div className="overflow-x-auto rounded-xl border border-[#17196c]/10 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-[#17196c]/5">
            <tr className="text-left">
              <th className="px-4 py-2">Référence</th>
              <th className="px-4 py-2">Libellé</th>
              <th className="px-4 py-2">Format</th>
              <th className="px-4 py-2">Matière</th>
              <th className="px-4 py-2">Cond.</th>
              <th className="px-4 py-2">Carton</th>
            </tr>
          </thead>
          <tbody>
            {(p.variants || []).map((v, i) => (
              <tr key={v.reference} className={i % 2 ? "bg-white" : "bg-[#17196c]/[0.03]"}>
                <td className="px-4 py-2 font-medium whitespace-nowrap">{v.reference}</td>
                <td className="px-4 py-2">{v.libelle}</td>
                <td className="px-4 py-2">{v.format || "-"}</td>
                <td className="px-4 py-2">{v.matiere || "-"}</td>
                <td className="px-4 py-2">{v.cond || "-"}</td>
                <td className="px-4 py-2">{v.carton || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {p.image && (
        <img
          src={p.image}
          alt={p.name}
          className="rounded-xl border border-[#17196c]/10 object-cover w-full"
        />
      )}
    </div>
  </Page>
);

// -------------------
// Template hero
// -------------------
export const HeroTemplate: React.FC<{ p: ProductRecord }> = ({ p }) => (
  <Page>
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-3xl md:text-5xl font-extrabold">{p.name}</h1>
        <Divider className="my-4" />
        {p.description && <p className="text-lg opacity-90">{p.description}</p>}
        <ul className="mt-5 space-y-2">
          {(p.bullets || []).map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#e5813e]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      {p.image && (
        <img
          src={p.image}
          alt={p.name}
          className="rounded-2xl border border-[#17196c]/10 object-cover w-full"
        />
      )}
    </div>
  </Page>
);

// -------------------
// Sélecteur de template
// -------------------
export const renderByTemplate = (p: ProductRecord) => {
  if (p.template === "double") return <DoubleTemplate p={p} />;
  if (p.template === "hero") return <HeroTemplate p={p} />;
  return <SimpleTemplate p={p} />;
};
