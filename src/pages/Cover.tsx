import { Link } from "react-router-dom";

export default function Cover() {
  return (
    <section className="mx-auto my-6 bg-[#fff8f0] text-[#17196c] rounded-2xl shadow w-[920px] max-w-full aspect-[1/1.414] flex flex-col justify-between p-10 md:p-12">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="font-maeven text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mb-4">
          L’Art de la Table Durable
        </h2>

        <p className="font-roboto text-base md:text-lg opacity-90">
          Découvrez nos solutions durables pour la restauration.
        </p>

        <div className="flex justify-center mb-3 mt-4">
          <img
            src="/images/Logo_foxy.png"
            alt="Logo FoxyTable"
            className="h-12 md:h-14 lg:h-16 object-contain"
          />
        </div>

        <div className="h-[3px] w-55 bg-[#e5813e] rounded-full mx-auto" />
      </div>

      {/* IMAGE PLEIN CADRE */}
      <div className="flex-1 flex items-center justify-center mt-6 mb-6">
        <div className="relative w-[95%] h-[520px] md:h-[620px] rounded-xl overflow-hidden border border-[#17196c]/15 shadow-sm">
          <img
            src="/images/cover.png"
            alt="Couverture FoxyTable"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-[#17196c] text-white text-sm md:text-lg font-extrabold rounded-lg px-4 py-1.5 shadow">
            2026
          </div>
        </div>
      </div>

      {/* CTA — React Router Link (pas <a href=...>) */}
      <div className="mt-2 flex justify-center">
        <Link
          to="/catalogue"
          className="font-roboto flex items-center gap-2 bg-[#17196c] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#e5813e] transition shadow-md"
        >
          Entrer dans le catalogue →
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="flex flex-col items-center justify-center gap-3 mt-4">
        <div className="flex items-center justify-center gap-4 text-sm md:text-base">
          <img src="/images/Logo_foxy.png" alt="FoxyTable" className="h-6 md:h-7 object-contain" />
          <span className="h-4 w-[2px] bg-[#17196c]/40" />
          <span>foxytable.com</span>
        </div>
        <div className="h-[3px] w-full bg-[#17196c] rounded-full" />
      </footer>
    </section>
  );
}
