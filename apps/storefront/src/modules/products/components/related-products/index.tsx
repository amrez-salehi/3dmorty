import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"
import RelatedProductsCarousel from "./carousel"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const metadata = (product.metadata || {}) as Record<string, unknown>
  const textValues = (value: unknown) =>
    Array.isArray(value) ? value.map(String) : value ? [String(value)] : []
  const productTags = new Set([
    ...(product.tags || []).map((tag) => tag.value).filter(Boolean),
    ...textValues(metadata.tags),
  ])
  const products = await listProducts({
    queryParams: { is_giftcard: false, limit: 100 },
    countryCode,
  }).then(({ response }) =>
    response.products
      .filter((candidate) => candidate.id !== product.id)
      .map((candidate) => {
        const candidateMetadata = (candidate.metadata || {}) as Record<string, unknown>
        const candidateTags = new Set([
          ...(candidate.tags || []).map((tag) => tag.value).filter(Boolean),
          ...textValues(candidateMetadata.tags),
        ])
        const sharedTags = Array.from(productTags).filter((tag) => candidateTags.has(tag)).length
        const score =
          (metadata.catalog_group === candidateMetadata.catalog_group ? 5 : 0) +
          (metadata.product_type === candidateMetadata.product_type ? 4 : 0) +
          (metadata.character && metadata.character === candidateMetadata.character ? 5 : 0) +
          (metadata.use_cases === candidateMetadata.use_cases ? 2 : 0) +
          sharedTags * 2
        return { candidate, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ candidate }) => candidate)
  )

  if (!products.length) {
    return null
  }

  return (
    <div className="content-container">
      <div className="mb-8 flex items-end justify-between border-b border-[var(--color-border)] pb-6">
        <div>
          <p className="text-xs font-medium text-[var(--color-accent-dark)]">محصولات مرتبط</p>
          <h2 className="mt-3 text-2xl font-medium text-[var(--color-ink)] small:text-3xl">انتخاب‌های هم‌تم</h2>
          <p className="mt-2 text-xs text-[var(--color-muted)]">بر پایهٔ دسته، کاربرد، تم و ویژگی‌های همین محصول.</p>
        </div>
        <LocalizedClientLink href="/store" className="hd-link hidden small:inline-flex">مشاهده محصولات بیشتر</LocalizedClientLink>
      </div>

      <RelatedProductsCarousel>
        <ul className="flex snap-x gap-3 pb-2 small:gap-4">
          {products.map((product) => (
            <li key={product.id} className="box-border w-[72vw] max-w-[280px] shrink-0 snap-start small:w-[260px]">
              <Product region={region} product={product} isRelated countryCode={countryCode} />
            </li>
          ))}
        </ul>
      </RelatedProductsCarousel>
      <div className="mt-6 flex justify-center gap-2" aria-label="صفحه‌های کالاهای مشابه">
        {Array.from({ length: Math.min(4, Math.max(1, Math.ceil(products.length / 5))) }).map((_, index) => (
          <span key={index} className={`h-1.5 ${index === 0 ? "w-6 bg-[var(--color-accent-dark)]" : "w-1.5 bg-[var(--color-border)]"}`} />
        ))}
      </div>
    </div>
  )
}
