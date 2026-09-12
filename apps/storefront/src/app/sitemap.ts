import type { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

const publicPaths = [
  "",
  "/store",
  "/collections",
  "/offers",
  "/faq",
  "/contact",
  "/content/privacy-policy",
  "/content/terms-of-use",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseURL().replace(/\/$/, "")
  const countryCode = (process.env.NEXT_PUBLIC_DEFAULT_REGION || "dk").toLowerCase()

  return publicPaths.map((path) => ({
    url: `${baseUrl}/${countryCode}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/store" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }))
}
