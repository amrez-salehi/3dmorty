import { Suspense } from "react"

import { OptionValueIds } from "@lib/util/product-option-filters"
import { CatalogFacet } from "@lib/catalog-facets"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getCatalogPriceRange } from "@lib/data/products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
  q,
  priceMin,
  priceMax,
  inStock,
  catalogFacets,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
  q?: string
  priceMin?: string
  priceMax?: string
  inStock?: boolean
  catalogFacets?: CatalogFacet[]
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const priceRange = await getCatalogPriceRange({ countryCode })

  return (
    <div
      className="catalog-page content-container min-w-0 overflow-x-hidden py-6 small:py-10"
      data-testid="category-container"
    >
      <header className="mb-6 border-b border-[var(--color-border)] pb-5 small:mb-8 small:pb-6">
        <h1
          className="text-[26px] font-medium leading-[1.5] tracking-[-.035em] text-[var(--color-ink)] small:text-[34px]"
          data-testid="store-page-title"
        >
          {q ? `نتایج برای «${q}»` : "همه محصولات"}
        </h1>
      </header>
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1 small:mb-8">
        {[
          { label: "همه", href: "/store", active: !q },
          { label: "فیگور و کلکسیونی", href: "/categories/figures-collectibles" },
          { label: "مفصلی و متحرک", href: "/store?facet=articulated" },
          { label: "اکسسوری گیمینگ", href: "/categories/desk-gaming" },
          { label: "لوازم میز", href: "/store?facet=desktop_accessory" },
          { label: "کاربردی و دکوری", href: "/categories/organizers-decor" },
          { label: "هدیه و اکسسوری", href: "/categories/gift-hair-accessories" },
        ].map(({ label, href, active }) => (
          <LocalizedClientLink
            key={label}
            href={href}
            className={`shrink-0 border px-4 py-2.5 text-xs transition ${
              active
                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-ink)]"
            }`}
          >
            {label}
          </LocalizedClientLink>
        ))}
      </div>
      <div className="flex min-w-0 flex-col small:flex-row small:items-start">
        <RefinementList sortBy={sort} priceRange={priceRange} />
        <div className="min-w-0 flex-1">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
              q={q}
              priceMin={priceMin}
              priceMax={priceMax}
              inStock={inStock}
              catalogFacets={catalogFacets}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
