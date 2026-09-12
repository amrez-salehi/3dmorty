import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { ComponentProps } from "react"

import FavoriteButton from "."
import type { FavoriteProduct } from "@lib/favorites/types"

const toggleFavorite = vi.fn()
const favoriteState = {
  active: false,
  pending: false,
  authenticated: true,
}

vi.mock("@modules/favorites/context/favorites-context", () => ({
  useFavorites: () => ({
    authenticated: favoriteState.authenticated,
    isFavorite: () => favoriteState.active,
    isPending: () => favoriteState.pending,
    toggleFavorite,
  }),
}))

vi.mock("@modules/common/components/localized-client-link", () => ({
  default: ({ children, ...props }: ComponentProps<"a">) => (
    <a {...props}>{children}</a>
  ),
}))

const product = {
  id: "prod_test",
  title: "گلدان سفالی",
  handle: "clay-vase",
} as unknown as FavoriteProduct

describe("FavoriteButton", () => {
  beforeEach(() => {
    favoriteState.active = false
    favoriteState.pending = false
    favoriteState.authenticated = true
    toggleFavorite.mockReset().mockResolvedValue(undefined)
  })

  it("adds an inactive product without navigating", () => {
    render(<FavoriteButton product={product} />)
    const button = screen.getByRole("button", { name: "افزودن به علاقه‌مندی‌ها" })

    fireEvent.click(button)

    expect(toggleFavorite).toHaveBeenCalledWith(product)
    expect(button).toHaveAttribute("aria-pressed", "false")
  })

  it("shows the remove state for a saved product", () => {
    favoriteState.active = true
    render(<FavoriteButton product={product} variant="detail" />)

    expect(
      screen.getByRole("button", { name: "حذف از علاقه‌مندی‌ها" })
    ).toHaveAttribute("aria-pressed", "true")
  })

  it("disables interaction while the request is pending", () => {
    favoriteState.pending = true
    render(<FavoriteButton product={product} />)

    expect(screen.getByRole("button")).toBeDisabled()
    fireEvent.click(screen.getByRole("button"))
    expect(toggleFavorite).not.toHaveBeenCalled()
  })

  it("asks guests to sign in before saving a product", () => {
    favoriteState.authenticated = false
    render(<FavoriteButton product={product} />)

    fireEvent.click(screen.getByRole("button", { name: "افزودن به علاقه‌مندی‌ها" }))

    expect(toggleFavorite).not.toHaveBeenCalled()
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "ورود یا ثبت‌نام" })).toHaveAttribute("href", "/account")
  })
})
