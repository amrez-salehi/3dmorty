"use client"

import Medusa from "@medusajs/js-sdk"

const adminProxyUrl = typeof window === "undefined"
  ? "/api/medusa"
  : new URL("/api/medusa", window.location.origin).toString()

export const adminSdk = new Medusa({
  // The Medusa SDK normalizes request paths through `new URL(baseUrl)`, so a
  // relative base URL prevents every browser-side request before it reaches
  // the Next proxy.
  baseUrl: adminProxyUrl,
  // Authentication is stored only in the HttpOnly cookie issued by the proxy.
  // Without session mode the SDK uses `credentials: omit`, so the browser
  // drops the login cookie and every following admin request is unauthorized.
  auth: {
    type: "session",
    fetchCredentials: "include",
  },
  debug: process.env.NODE_ENV === "development",
})

export type AdminProduct = {
  id: string
  title: string
  handle?: string
  description?: string | null
  thumbnail?: string | null
  images?: Array<{ id?: string; url: string }>
  status?: string
  variants?: Array<{
    id?: string
    prices?: Array<{ id?: string; amount?: number; currency_code?: string }>
    inventory_quantity?: number
    inventory_items?: Array<{ inventory_item_id?: string; inventory_item?: { id?: string } }>
  }>
}

export const toman = (amount = 0) => `${Math.round(amount).toLocaleString("fa-IR")} تومان`
