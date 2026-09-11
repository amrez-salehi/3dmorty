const names: Record<string, string> = {
  "figures-collectibles": "فیگورها و کلکسیونی",
  "desk-gaming": "گیمینگ و میز کار",
  "organizers-decor": "دکور و نظم‌دهنده",
  "gift-hair-accessories": "هدیه و اکسسوری",
}

export function getPersianCategoryName(handle?: string | null, fallback?: string | null) {
  return names[handle || ""] || fallback || "دسته‌بندی کالاها"
}
