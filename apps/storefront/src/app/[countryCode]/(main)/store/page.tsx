import { Metadata } from "next"

import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { parseCatalogFacets } from "@lib/catalog-facets"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "همه محصولات",
  description: "تمام فیگورها، کالکتبل‌ها، دکورها و اکسسوری‌های چاپ سه‌بعدی 3DMorty.",
}

type StorePageSearchParams = Record<string, string | string[] | undefined> & {
  sortBy?: SortOptions
  page?: string
  optionValueIds?: string | string[]
  q?: string
  priceMin?: string
  priceMax?: string
  inStock?: string
  facet?: string | string[]
}

type Params = {
  searchParams: Promise<StorePageSearchParams>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, q, priceMin, priceMax, inStock } = searchParams
  const optionValueIds = parseOptionValueIds(searchParams)
  const catalogFacets = parseCatalogFacets(searchParams)

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      optionValueIds={optionValueIds}
      q={q}
      priceMin={priceMin}
      priceMax={priceMax}
      inStock={inStock === "true"}
      catalogFacets={catalogFacets}
    />
  )
}
