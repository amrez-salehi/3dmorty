import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BrandLogoProps = {
  className?: string
  imageClassName?: string
  priority?: boolean
  markOnly?: boolean
  compact?: boolean
}

export default function BrandLogo({
  className = "",
  imageClassName = "",
  priority: _priority = false,
  markOnly = false,
  compact = false,
}: BrandLogoProps) {
  if (markOnly) {
    return (
      <LocalizedClientLink
        href="/"
        aria-label="3DMorty"
        className={`morty-mark inline-flex h-10 w-10 shrink-0 items-center justify-center ${className}`}
      >
        <span aria-hidden="true">3D</span>
      </LocalizedClientLink>
    )
  }

  return (
    <LocalizedClientLink
      href="/"
      aria-label="3DMorty"
      className={`inline-flex shrink-0 items-center ${compact ? "gap-2.5" : "gap-3"} ${className}`}
    >
      <span className={`morty-mark ${compact ? "h-10 w-10 text-[11px]" : "h-12 w-12 text-xs"} ${imageClassName}`} aria-hidden="true">3D</span>
      <span className="flex flex-col items-start leading-none" aria-hidden="true">
        <strong className={`font-latin font-bold tracking-[0.04em] text-[var(--color-ink)] ${compact ? "text-[15px]" : "text-[18px]"}`}>3DMorty</strong>
        <span className={`mt-1 tracking-[0.1em] text-[var(--color-muted)] ${compact ? "text-[7px]" : "text-[9px]"}`}>فیگور · دکور · گیمینگ</span>
      </span>
    </LocalizedClientLink>
  )
}
