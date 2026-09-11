import { Metadata } from "next"

import HomeLanding from "@modules/home/components/home-landing"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getLocale } from "@lib/data/locale-actions"

export const metadata: Metadata = {
  title: "فیگور، دکور و کالکتبل چاپ سه‌بعدی",
  description: "فیگورها، اکسسوری‌های گیمینگ، دکورهای رومیزی و هدیه‌های کلکسیونی 3DMorty.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 100,
      fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,*categories",
    },
  })
  const locale = await getLocale()

  if (!region) {
    return null
  }

  return <HomeLanding products={response.products} region={region} locale={locale} />
}
