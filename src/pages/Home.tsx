import { Link } from "react-router-dom";
import data from "../data/products.json";


export default function Home() {
const products = data as any[];
return (
<main className="bg-[#fff8f0] min-h-screen text-[#17196c] p-6 md:p-10">
<h1 className="text-3xl md:text-4xl font-extrabold">Catalogue FoxyTable</h1>
<div className="h-1 w-24 bg-[#e5813e] rounded-full my-3" />
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
{products.map((p) => (
<Link key={p.slug} to={`/p/${p.slug}`} className="bg-white rounded-xl border border-[#17196c]/10 overflow-hidden hover:shadow-md">
{p.image && <img src={p.image} alt={p.name} className="w-full aspect-[4/3] object-cover" />}
<div className="p-4">
<p className="text-xs opacity-60">{p.category}</p>
<h2 className="font-semibold">{p.name}</h2>
{p.description && <p className="text-xs opacity-70 mt-1 line-clamp-2">{p.description}</p>}
</div>
</Link>
))}
</div>
</main>
);
}