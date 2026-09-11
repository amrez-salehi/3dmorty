import { Suspense } from "react"

import { getLocale } from "@lib/data/locale-actions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SearchBar from "@modules/layout/components/search-bar"
import MobileMenu from "@modules/layout/components/mobile-menu"
import { BrandCube } from "@modules/common/components/brand-logo"

const Icon = ({
  name,
}: {
  name: "search" | "user" | "home" | "grid" | "menu" | "heart"
}) => {
  if (name === "search")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.8" cy="10.8" r="6.3" />
        <path d="m15.5 15.5 4.3 4.3" />
      </svg>
    )
  if (name === "user")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5.4 20c.8-3.8 3-5.8 6.6-5.8s5.8 2 6.6 5.8" />
      </svg>
    )
  if (name === "home")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 10.8 8-6.5 8 6.5V20h-5.2v-5.7H9.2V20H4Z" />
      </svg>
    )
  if (name === "grid")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="6" height="6" />
        <rect x="14" y="4" width="6" height="6" />
        <rect x="4" y="14" width="6" height="6" />
        <rect x="14" y="14" width="6" height="6" />
      </svg>
    )
  if (name === "heart")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.3 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

const desktopLinks = [
  ["فیگورها", "/categories/figures-collectibles"],
  ["گیمینگ", "/categories/desk-gaming"],
  ["کالکشن‌ها", "/collections"],
  ["تازه‌ها", "/store?sortBy=created_at"],
]

export default async function Nav() {
  const currentLocale = await getLocale()
  const isPersian = currentLocale?.toLowerCase().startsWith("fa")

  return (
    <>
      <div className="sticky inset-x-0 top-0 z-40">
        <header className="brand-header isolate">
          <nav className="content-container brand-header-nav" aria-label="ناوبری اصلی">
            <div className="brand-header-mobile">
              <MobileMenu />
              <LocalizedClientLink
                href="/search"
                className="brand-icon-button"
                aria-label="جست‌وجو"
              >
                <Icon name="search" />
              </LocalizedClientLink>
            </div>
            <LocalizedClientLink href="/" aria-label="3DMorty" className="brand-header-logo brand-header-logo-mobile"><BrandMark /></LocalizedClientLink>
            <div className="brand-header-desktop">
              <LocalizedClientLink href="/" aria-label="3DMorty" className="brand-header-logo"><BrandMark /></LocalizedClientLink>
              <div className="brand-header-links">
              {desktopLinks.map(([label, href]) => (
                <LocalizedClientLink
                  key={href}
                  href={href}
                  className="brand-nav-link"
                >
                  {label}
                </LocalizedClientLink>
              ))}
              </div>
              <div className="brand-header-search"><SearchBar compact variant="dark-header" placeholder={isPersian ? "جست‌وجوی محصولات، شخصیت‌ها، دکور و ..." : "Search products"} /></div>
              <div className="brand-header-actions">
              <LocalizedClientLink
                href="/favorites"
                className="brand-icon-button"
                aria-label="علاقه‌مندی‌ها"
              >
                <Icon name="heart" />
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/account"
                className="brand-icon-button"
                aria-label={isPersian ? "حساب کاربری" : "Account"}
              >
                <Icon name="user" />
              </LocalizedClientLink>
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="header-cart-button"
                    href="/cart"
                    aria-label="سبد خرید"
                  >
                    <span className="text-lg">□</span>
                  </LocalizedClientLink>
                }
              >
                <CartButton locale={currentLocale} />
              </Suspense>
              </div>
            </div>
          </nav>
        </header>
      </div>

      <nav className="mobile-bottom-nav" aria-label="دسترسی سریع موبایل">
        <LocalizedClientLink href="/">
          <Icon name="home" />
          <span>خانه</span>
        </LocalizedClientLink>
        <LocalizedClientLink href="/store">
          <Icon name="grid" />
          <span>فروشگاه</span>
        </LocalizedClientLink>
        <LocalizedClientLink href="/search">
          <Icon name="search" />
          <span>جست‌وجو</span>
        </LocalizedClientLink>
        <LocalizedClientLink href="/favorites">
          <Icon name="heart" />
          <span>علاقه‌مندی</span>
        </LocalizedClientLink>
        <LocalizedClientLink href="/account">
          <Icon name="user" />
          <span>حساب</span>
        </LocalizedClientLink>
      </nav>
    </>
  )
}

function BrandMark() {
  return <><BrandCube className="brand-header-cube" /><span className="brand-header-wordmark"><strong>3DMORTY</strong><small>فراتر از تخیل، در دستان تو</small></span></>
}
