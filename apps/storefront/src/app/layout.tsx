import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "../styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "3DMorty | فیگور، دکور و کالکتبل چاپ سه‌بعدی",
    template: "%s | 3DMorty",
  },
  description: "فروشگاه 3DMorty؛ فیگورها، کالکتبل‌ها، اکسسوری‌های گیمینگ و دکورهای چاپ سه‌بعدی.",
  applicationName: "3DMorty",
  keywords: ["3DMorty", "چاپ سه‌بعدی", "فیگور", "اکشن فیگور", "دکور گیمینگ", "کالکتبل"],
  openGraph: {
    siteName: "3DMorty",
    title: "3DMorty | فیگور، دکور و کالکتبل چاپ سه‌بعدی",
    description: "فیگورها، اکسسوری‌های گیمینگ و دکورهای چاپ سه‌بعدی برای میز، شلف و کلکسیون.",
    type: "website",
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
