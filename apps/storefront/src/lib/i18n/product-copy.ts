import { HttpTypes } from "@medusajs/types"

export function getPersianProductCopy(
  product: Pick<HttpTypes.StoreProduct, "handle" | "title" | "description">
) {
  return {
    title: product.title || "محصول چاپ سه‌بعدی",
    description: product.description || "",
  }
}
