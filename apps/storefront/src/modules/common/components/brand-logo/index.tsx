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
        className={`brand-logo-mark inline-flex h-10 w-10 shrink-0 items-center justify-center ${className}`}
      >
        <BrandCube />
      </LocalizedClientLink>
    )
  }

  return (
    <LocalizedClientLink
      href="/"
      aria-label="3DMorty"
      className={`inline-flex shrink-0 items-center ${compact ? "gap-2.5" : "gap-3"} ${className}`}
    >
      <span className={`brand-logo-cube ${compact ? "h-10 w-10" : "h-12 w-12"} ${imageClassName}`} aria-hidden="true"><BrandCube /></span>
      <span className="flex flex-col items-start leading-none" aria-hidden="true">
        <strong className={`font-latin font-bold tracking-[0.04em] text-[var(--color-ink)] ${compact ? "text-[15px]" : "text-[18px]"}`}>3DMORTY</strong>
        <span className={`mt-1 tracking-[0.02em] text-[var(--color-muted)] ${compact ? "text-[7px]" : "text-[9px]"}`}>فراتر از تخیل، در دستان تو</span>
      </span>
    </LocalizedClientLink>
  )
}

export function BrandCube({ className = "" }: { className?: string }) {
  return (
    <svg className={`brand-cube-mark ${className}`} viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path d="m26 4 20 11-20 11L6 15 26 4Z" fill="#a476f7" stroke="#d1b8ff" strokeOpacity=".7" strokeWidth=".8" />
      <path d="M6 15 26 26v22L6 37V15Z" fill="#7548db" stroke="#b493ff" strokeOpacity=".62" strokeWidth=".8" />
      <path d="M46 15 26 26v22l20-11V15Z" fill="#5632b9" stroke="#ae8bfb" strokeOpacity=".5" strokeWidth=".8" />
    </svg>
  )
}
