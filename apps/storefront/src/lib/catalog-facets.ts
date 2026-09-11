export const CATALOG_FACET_QUERY_KEY = "facet"

export const CATALOG_FACETS = [
  { id: "collectible", label: "کلکسیونی" },
  { id: "articulated", label: "مفصلی و متحرک" },
  { id: "gaming_accessory", label: "اکسسوری گیمینگ" },
  { id: "desktop_accessory", label: "مناسب میز" },
  { id: "functional", label: "کاربردی" },
  { id: "decorative", label: "دکوری" },
] as const

export type CatalogFacet = (typeof CATALOG_FACETS)[number]["id"]

const facetIds = new Set<string>(CATALOG_FACETS.map((facet) => facet.id))

export const parseCatalogFacets = (input: {
  get?: (key: string) => string | null
  getAll?: (key: string) => string[]
  facet?: string | string[]
}): CatalogFacet[] => {
  const values = input.getAll
    ? input.getAll(CATALOG_FACET_QUERY_KEY)
    : Array.isArray(input.facet)
      ? input.facet
      : input.facet
        ? [input.facet]
        : []

  return Array.from(new Set(values.filter((value): value is CatalogFacet => facetIds.has(value))))
}
