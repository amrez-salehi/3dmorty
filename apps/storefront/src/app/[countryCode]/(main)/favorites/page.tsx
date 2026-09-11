import type { Metadata } from "next"

import FavoritesPage from "@modules/favorites/templates/favorites-page"

export const metadata: Metadata = {
  title: "علاقه‌مندی‌ها",
  description: "محصولات ذخیره‌شده شما در 3DMorty.",
}

export default function Page() {
  return <FavoritesPage />
}
