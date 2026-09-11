import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import HomeHeroSlider from "@modules/home/components/home-hero-slider"

const categoryEdits = [
  { title: "فیگورها و کلکسیونی", image: "/images/3dmorty/catalog/model-08-viking-bust/01-front-three-quarter.png", href: "/categories/figures-collectibles" },
  { title: "گیمینگ و میز کار", image: "/images/3dmorty/catalog/model-18-world-cup-controller-stand/01-front-three-quarter.png", href: "/categories/desk-gaming" },
  { title: "دکور و نظم‌دهنده", image: "/images/3dmorty/catalog/06-gothic-corset-brush-holder.png", href: "/categories/organizers-decor" },
  { title: "هدیه و اکسسوری", image: "/images/3dmorty/catalog/12-botanical-hair-stick-lifestyle.png", href: "/categories/gift-hair-accessories" },
]

const benefits = [
  { title: "طراحی متفاوت", description: "فیگور و دکور برای سلیقه‌های خاص", icon: "select" },
  { title: "چاپ سه‌بعدی", description: "جزئیات لایه‌ای و فرم‌های کلکسیونی", icon: "material" },
  { title: "ارسال مطمئن", description: "بسته‌بندی مناسب محصولات ظریف", icon: "delivery" },
  { title: "انتخاب آگاهانه", description: "جزئیات محصول پیش از خرید در دسترس است", icon: "return" },
] as const

function BenefitIcon({ name }: { name: (typeof benefits)[number]["icon"] }) {
  if (name === "select") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5 9.2 17 19 6.5" />
      </svg>
    )
  }

  if (name === "material") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
        <path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" />
      </svg>
    )
  }

  if (name === "delivery") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 6.5h11v10h-11zM14.5 10h3l3 3v3.5h-6z" />
        <circle cx="7" cy="18" r="1.5" />
        <circle cx="17.5" cy="18" r="1.5" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 8.5A7.5 7.5 0 1 1 5 15" />
      <path d="M5.5 4v4.5H10" />
    </svg>
  )
}

export default function HomeLanding({
  products,
  region,
}: {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  locale?: string | null
}) {
  const inGroup = (group: string) =>
    products.filter(
      (product) =>
        (product.metadata as Record<string, unknown> | undefined)?.catalog_group === group
    )
  const newest = products.filter(
    (product) => (product.metadata as Record<string, unknown> | undefined)?.featured === true
  )
  const figures = inGroup("figures-collectibles")
  const accessoriesAndDecor = products.filter(
    (product) =>
      (product.metadata as Record<string, unknown> | undefined)?.catalog_group !==
      "figures-collectibles"
  )

  return (
    <main className="home-cosmos overflow-hidden text-[var(--color-text)]">
      <section className="content-container pt-4 small:pt-7" aria-labelledby="home-hero-title">
        <HomeHeroSlider />
      </section>

      <section className="content-container" aria-label="مزیت‌های 3DMorty">
        <div className="home-benefits">
          {benefits.map((item) => (
            <div key={item.title} className="home-benefit">
              <span className="home-benefit-icon"><BenefitIcon name={item.icon} /></span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="content-container scroll-mt-[190px] py-16 small:py-24" aria-labelledby="categories-title">
        <div className="mb-8 max-w-2xl small:mb-12">
          <p className="text-xs font-medium text-[var(--color-accent-dark)]">3DMorty / دنیای چاپ سه‌بعدی</p>
          <h2 id="categories-title" className="hd-section-title mt-2">کالکشن مورد علاقه‌ات را پیدا کن</h2>
        </div>
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 small:mx-0 small:grid small:grid-cols-4 small:gap-5 small:px-0">
          {categoryEdits.map((category) => (
            <LocalizedClientLink key={category.title} href={category.href} className="group block w-[78vw] max-w-[360px] shrink-0 snap-center small:w-auto small:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-[var(--color-surface)]">
                <Image src={category.image} alt={category.title} fill sizes="(max-width: 1023px) 78vw, 33vw" className="hd-image object-cover group-hover:scale-[1.02]" />
              </div>
              <div className="border-b border-[var(--color-border)] py-4 small:py-5">
                <h3 className="text-lg font-medium text-[var(--color-ink)] small:text-xl">{category.title}</h3>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
        <LocalizedClientLink href="/store" className="hd-link mt-7">مشاهده همه محصولات</LocalizedClientLink>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-16 small:py-24" aria-labelledby="new-title">
        <div className="content-container">
          <div className="mb-9 flex items-end justify-between gap-5 small:mb-12">
            <div><h2 id="new-title" className="hd-section-title">تازه در 3DMorty</h2><p className="hd-body mt-3 max-w-xl">مدل‌های جدید برای میز، شلف و کلکسیون شما.</p></div>
            <LocalizedClientLink href="/store?sortBy=created_at" className="hd-link hidden xsmall:inline-flex">مشاهده همه</LocalizedClientLink>
          </div>
          <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 small:mx-0 small:grid small:grid-cols-4 small:gap-5 small:px-0">
            {(newest.length ? newest : products).slice(0, 8).map((product) => <li key={product.id} className="w-[72vw] max-w-[310px] shrink-0 snap-start small:w-auto small:max-w-none"><ProductPreview product={product} region={region} isFeatured /></li>)}
          </ul>
          <LocalizedClientLink href="/store?sortBy=created_at" className="hd-button-outline mt-8 w-full xsmall:hidden">همه تازه‌ها</LocalizedClientLink>
        </div>
      </section>

      <section className="content-container py-16 small:py-28" aria-labelledby="best-title">
        <div className="mb-9 text-right small:mb-14"><p className="text-xs font-medium text-[var(--color-accent-dark)]">برای هدیه یا کلکسیون</p><h2 id="best-title" className="hd-section-title mt-2">فیگورها و مدل‌های کلکسیونی</h2></div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-10 small:grid-cols-4 small:gap-x-5">{figures.slice(0, 8).map((product) => <li key={product.id}><ProductPreview product={product} region={region} /></li>)}</ul>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-16 small:py-24" aria-labelledby="gaming-title">
        <div className="content-container"><div className="mb-9 flex items-end justify-between gap-5"><div><p className="text-xs font-medium text-[var(--color-accent-dark)]">برای میز، نظم‌دهی و هدیه</p><h2 id="gaming-title" className="hd-section-title mt-2">اکسسوری و دکوری‌های خاص</h2></div><LocalizedClientLink href="/store?facet=functional" className="hd-link hidden xsmall:inline-flex">مشاهده همه</LocalizedClientLink></div><ul className="grid grid-cols-2 gap-x-3 gap-y-10 small:grid-cols-4 small:gap-x-5">{accessoriesAndDecor.slice(0, 8).map((product) => <li key={product.id}><ProductPreview product={product} region={region} /></li>)}</ul></div>
      </section>
    </main>
  )
}
