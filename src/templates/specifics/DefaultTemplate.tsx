import {
  PageHeader,
  SpecTable,
  SHEET_ROWS,
  type ProductRecord,
} from "../common";

export default function DefaultTemplate({
  product,
  hideTopImage = false,
  hideBottomImage = false,
}: {
  product: ProductRecord;
  hideTopImage?: boolean;
  hideBottomImage?: boolean;
}) {
  const row2Cols = hideTopImage
    ? "grid-cols-1"
    : "md:grid-cols-[32%_4%_64%] grid-cols-1";

  const hero = product.heroImage || product.image;

  return (
    <div
      className="relative h-full w-full grid gap-4 md:gap-5"
      style={{ gridTemplateRows: SHEET_ROWS }}
    >
      {/* Row 1 */}
      <div className="row-start-1 row-end-2">
        <PageHeader
          title={product.title}
          subtitle={product.subtitle}
          temperature={product.packaging?.temperature}
        />
      </div>

      {/* Row 2 : image + tableau */}
      <section
        className={`row-start-2 row-end-3 grid items-stretch h-full ${row2Cols}`}
      >
        {!hideTopImage && (
          <>
            <div className="rounded-lg border border-[#191970]/40 bg-white h-full grid place-items-center overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain object-center"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="hidden md:block" />
          </>
        )}

        {/* Tableau : hauteur mini pour éviter l’écrasement */}
        <div className="h-full min-h-[280px]">
          <SpecTable rows={product.specs} />
        </div>
      </section>

      {/* Row 3 : visuel bas (bande maîtrisée) */}
      {hideBottomImage ? (
        <section className="row-start-3 row-end-4 h-full" />
      ) : (
        <section className="row-start-3 row-end-4 rounded-xl overflow-hidden border border-[#191970]/40 bg-white h-full">
          <img
            src={hero}
            alt={`${product.title} - ambiance`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </section>
      )}
    </div>
  );
}
