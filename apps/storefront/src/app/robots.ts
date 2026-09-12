import type { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseURL().replace(/\/$/, "")

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dk/account", "/dk/cart", "/dk/checkout", "/dk/order"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
