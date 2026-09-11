import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = { product: HttpTypes.StoreProduct }

const labelFor = (key: string) =>
  ({
    product_type: "نوع محصول",
    print_material: "متریال چاپ",
    print_technology: "فناوری چاپ",
    color: "رنگ",
    dimensions: "ابعاد تقریبی",
    style: "تم و سبک",
    character: "شخصیت / مجموعه",
    compatibility: "سازگاری",
    use_cases: "کاربرد پیشنهادی",
    articulated: "قابلیت حرکت",
    number_of_pieces: "تعداد قطعات",
  })[key]

const iconFor = (key: string) => {
  if (key === "dimensions") return <RulerIcon />
  if (key === "color") return <ColorIcon />
  if (key === "articulated") return <MotionIcon />
  return <PrintIcon />
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const metadata = (product.metadata || {}) as Record<string, unknown>
  const textValue = (key: string) => {
    const value = metadata[key]
    if (typeof value === "string" && value.trim()) return value
    if (typeof value === "number") return String(value)
    if (value === true && key === "articulated") return "دارد"
    if (value === false && key === "articulated") return "ندارد"
    return undefined
  }
  const specs = [
    "product_type",
    "print_material",
    "print_technology",
    "color",
    "dimensions",
    "style",
    "character",
    "compatibility",
    "use_cases",
    "articulated",
    "number_of_pieces",
  ].flatMap((key) => {
    const value = textValue(key)
    const label = labelFor(key)
    return value && label ? [{ key, label, value }] : []
  })
  const care = textValue("care")

  return (
    <section className="border-y border-[var(--color-border)] py-10 small:py-14" aria-labelledby="product-details-title">
      <div className="grid gap-10 small:grid-cols-[.65fr_1.35fr] small:gap-16">
        <div>
          <p className="text-xs font-medium text-[var(--color-accent-dark)]">مشخصات محصول</p>
          <h2 id="product-details-title" className="hd-section-title mt-3">جزئیات چاپ و کاربرد</h2>
          {product.description && <p className="hd-body mt-5 max-w-lg">{product.description}</p>}
        </div>
        <div>
          {specs.length > 0 && (
            <dl className="grid grid-cols-2 border-l border-t border-[var(--color-border)]">
              {specs.map((spec) => (
                <div key={spec.key} className="min-h-[150px] border-b border-r border-[var(--color-border)] p-4 xsmall:p-6">
                  <span className="text-[var(--color-accent-dark)]">{iconFor(spec.key)}</span>
                  <dt className="mt-5 text-xs font-medium text-[var(--color-ink)]">{spec.label}</dt>
                  <dd className="mt-2 text-[11px] leading-6 text-[var(--color-muted)] small:text-xs">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {care && (
            <div className="mt-7 border-t border-[var(--color-border)]">
              <details className="group border-b border-[var(--color-border)] py-1">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between py-3 text-sm font-medium"><span>نگهداری و مراقبت</span><span className="font-latin text-xl font-light transition group-open:rotate-45">+</span></summary>
                <p className="max-w-2xl pb-5 text-xs leading-7 text-[var(--color-muted)] small:text-sm">{care}</p>
              </details>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const Icon = ({ children }: { children: React.ReactNode }) => <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden="true">{children}</svg>
const PrintIcon = () => <Icon><path d="M7 8V4h10v4M7 16H5V9h14v7h-2M8 13h8v7H8z" /><path d="M10 17h4" /></Icon>
const MotionIcon = () => <Icon><path d="M4 12h10M10 8l4 4-4 4M20 6v12" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" /></Icon>
const ColorIcon = () => <Icon><circle cx="12" cy="12" r="8" /><path d="M8 9h.01M12 7h.01M16 9h.01M9 14c1.7 1.8 4.3 1.8 6 0" /></Icon>
const RulerIcon = () => <Icon><path d="m4 17 13-13 3 3L7 20H4v-3Z" /><path d="m10 8 2 2m1-5 2 2m-9 5 2 2" /></Icon>

export default ProductTabs
