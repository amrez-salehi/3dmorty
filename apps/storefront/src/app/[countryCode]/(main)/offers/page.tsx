import { Metadata } from "next"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import PageHero from "@modules/content/components/page-hero"
import ProductPreview from "@modules/products/components/product-preview"

export const metadata: Metadata = {
  title: "محصولات منتخب 3DMorty",
  description: "مدل‌های منتخب چاپ سه‌بعدی، فیگورها و اکسسوری‌های کاربردی 3DMorty.",
}

export default async function OffersPage({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)
  if (!region) return null
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 12,
      fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata",
    },
  })

  return <main><PageHero eyebrow="3DMorty / منتخب‌ها" title="محصولات منتخب" description="چند مدل قابل‌توجه از فیگورها، محصولات مفصلی و اکسسوری‌های چاپ سه‌بعدی." compact /><section className="content-container pb-20 small:pb-28"><div className="mb-8 border-y border-[var(--color-border)] py-4 text-xs text-[var(--color-muted)]">{response.products.length.toLocaleString("fa-IR")} محصول</div><ul className="grid grid-cols-2 gap-x-3 gap-y-10 small:grid-cols-4 small:gap-x-5 small:gap-y-14">{response.products.map((product) => <li key={product.id}><ProductPreview product={product} region={region} /></li>)}</ul></section></main>
}
