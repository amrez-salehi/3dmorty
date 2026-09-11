import "./admin.css"

export const metadata = { title: "پنل مدیریت | 3DMorty", description: "پنل مدیریت فارسی فروشگاه 3DMorty" }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div dir="rtl" lang="fa">{children}</div>
}
