"use server"

import { sdk } from "@lib/config"
import { CatalogFacet } from "@lib/catalog-facets"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

type ProductListQueryParams = (HttpTypes.FindParams &
  HttpTypes.StoreProductListParams) & {
  options?: string[]
  option_value_id?: string | string[]
  price_min?: string
  price_max?: string
  in_stock?: string
  facet?: string | string[]
}

const normalizeSearchText = (value: unknown) =>
  String(value ?? "")
    .toLocaleLowerCase("fa-IR")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim()

const searchAliases: Record<string, string[]> = {
  ps5: ["پلی استیشن", "پلی‌استیشن", "playstation", "کنترلر"],
  controller: ["کنترلر", "دسته بازی", "استند کنترلر"],
  stand: ["استند", "پایه", "نگهدارنده"],
  holder: ["نگهدارنده", "هولدر", "استند"],
  figure: ["فیگور", "اکشن فیگور", "مجسمه"],
  anime: ["انیمه", "وان پیس", "وان‌پیس"],
  articulated: ["مفصلی", "متحرک", "انعطاف پذیر", "انعطاف‌پذیر"],
  skull: ["جمجمه", "گوتیک"],
  desk: ["میز", "رومیزی", "ستاپ"],
}

const metadataValues = (metadata: Record<string, unknown> | undefined) =>
  Object.values(metadata || {}).flatMap((value) =>
    Array.isArray(value) ? value : [value]
  )

const matchesCatalogSearch = (product: HttpTypes.StoreProduct, query?: string) => {
  const terms = normalizeSearchText(query).split(" ").filter(Boolean)
  if (!terms.length) return true

  const metadata = product.metadata as Record<string, unknown> | undefined
  const searchable = normalizeSearchText([
    product.title,
    product.description,
    product.handle,
    ...(product.tags || []).map((tag) => tag.value),
    ...(product.categories || []).flatMap((category) => [category.name, category.handle]),
    ...(product.variants || []).map((variant) => variant.sku),
    ...metadataValues(metadata),
  ].join(" "))

  return terms.every(
    (term) =>
      searchable.includes(term) ||
      searchAliases[term]?.some((alias) => searchable.includes(alias))
  )
}

const matchesCatalogFacets = (
  product: HttpTypes.StoreProduct,
  facets: CatalogFacet[]
) => {
  if (!facets.length) return true
  const metadata = (product.metadata || {}) as Record<string, unknown>

  return facets.every((facet) => metadata[facet] === true || metadata[facet] === "true")
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: ProductListQueryParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,",
          ...queryParams,
        },
        headers,
        // Product prices and inventory are editable from the custom admin
        // panel. Do not serve an old Next.js fetch cache after an admin edit.
        cache: "no-store",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  optionValueIds,
}: {
  page?: number
  queryParams?: ProductListQueryParams
  sortBy?: SortOptions
  countryCode: string
  optionValueIds?: OptionValueIds
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  const limit = queryParams?.limit || 12
  const { price_min, price_max, in_stock, q, facet, ...apiQueryParams } =
    queryParams || {}
  const catalogFacets = (Array.isArray(facet) ? facet : facet ? [facet] : []) as CatalogFacet[]
  const optionFilters = Array.from(
    new Set((optionValueIds || []).filter(Boolean))
  )

  const {
    response: { products },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...apiQueryParams,
      ...(optionFilters.length ? { option_value_id: optionFilters } : {}),
      limit: 100,
    },
    countryCode,
  })

  const filteredProducts = products.filter((product) => {
    const amount = Math.min(
      ...(product.variants || []).map(
        (variant) =>
          variant.calculated_price?.calculated_amount ??
          Number.POSITIVE_INFINITY
      )
    )
    const hasStock = (product.variants || []).some(
      (variant) => variant.manage_inventory === false || (variant.inventory_quantity ?? 0) > 0
    )
    const min = price_min ? Number(price_min) : null
    const max = price_max ? Number(price_max) : null

    return (
      (!min || amount >= min) &&
      (!max || amount <= max) &&
      (in_stock !== "true" || hasStock) &&
      matchesCatalogSearch(product, q) &&
      matchesCatalogFacets(product, catalogFacets)
    )
  })

  const sortedProducts = sortProducts(filteredProducts, sortBy)

  const pageParam = (page - 1) * limit

  const filteredCount = filteredProducts.length

  const nextPage = filteredCount > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count: filteredCount,
    },
    nextPage,
    queryParams,
  }
}

export const getCatalogPriceRange = async ({
  countryCode,
  categoryId,
  collectionId,
}: {
  countryCode: string
  categoryId?: string
  collectionId?: string
}): Promise<{ min: number; max: number }> => {
  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      limit: 100,
      ...(categoryId ? { category_id: [categoryId] } : {}),
      ...(collectionId ? { collection_id: [collectionId] } : {}),
    },
  })

  const productPrices = products
    .map((product) =>
      Math.min(
        ...(product.variants || [])
          .map((variant) => variant.calculated_price?.calculated_amount)
          .filter((amount): amount is number => Number.isFinite(amount))
      )
    )
    .filter((amount) => Number.isFinite(amount))

  if (!productPrices.length) return { min: 0, max: 0 }

  return {
    min: Math.min(...productPrices),
    max: Math.max(...productPrices),
  }
}
