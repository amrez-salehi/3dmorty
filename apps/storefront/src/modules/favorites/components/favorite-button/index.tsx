"use client"

import { useState } from "react"
import type { FavoriteProduct } from "@lib/favorites/types"
import { useFavorites } from "@modules/favorites/context/favorites-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function FavoriteButton({
  product,
  variant = "card",
  className = "",
}: {
  product: FavoriteProduct
  variant?: "card" | "detail"
  className?: string
}) {
  const { authenticated, isFavorite, isPending, toggleFavorite } = useFavorites()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const active = isFavorite(product.id)
  const pending = isPending(product.id)
  const label = active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"

  return (
    <>
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={pending}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        if (!authenticated) {
          setShowLoginPrompt(true)
          return
        }
        void toggleFavorite(product).catch(() => undefined)
      }}
      className={`group/favorite inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border transition duration-200 disabled:cursor-wait disabled:opacity-70 ${
        variant === "card"
          ? "h-11 w-11 bg-[rgba(244,246,255,.94)] shadow-[0_5px_18px_rgba(32,32,29,.08)] backdrop-blur"
          : "min-w-11 px-3.5 text-xs font-medium"
      } ${
        active
          ? "border-[var(--color-clay)] text-[var(--color-clay)]"
          : "border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-accent-muted)]"
      } ${className}`}
    >
      {pending ? <Spinner /> : <HeartIcon active={active} />}
      {variant === "detail" && <span>{label}</span>}
    </button>
    {showLoginPrompt && (
      <div className="favorite-login-backdrop" role="presentation" onMouseDown={() => setShowLoginPrompt(false)}>
        <div className="favorite-login-modal" role="dialog" aria-modal="true" aria-labelledby="favorite-login-title" onMouseDown={(event) => event.stopPropagation()}>
          <button type="button" className="favorite-login-close" aria-label="بستن" onClick={() => setShowLoginPrompt(false)}>×</button>
          <span className="favorite-login-icon" aria-hidden="true"><HeartIcon active /></span>
          <h2 id="favorite-login-title">برای افزودن به علاقه‌مندی‌ها وارد شوید</h2>
          <p>با ورود به حساب کاربری، انتخاب‌های شما همیشه ذخیره می‌مانند.</p>
          <LocalizedClientLink href="/account" className="favorite-login-action" onClick={() => setShowLoginPrompt(false)}>ورود یا ثبت‌نام</LocalizedClientLink>
        </div>
      </div>
    )}
    </>
  )
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-[21px] w-[21px] transition duration-200 group-active/favorite:scale-75 ${
        active ? "scale-110 fill-current" : "fill-none"
      }`}
      stroke="currentColor"
      strokeWidth="1.65"
      aria-hidden="true"
    >
      <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.3 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  )
}

function Spinner() {
  return (
    <span
      className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
  )
}
