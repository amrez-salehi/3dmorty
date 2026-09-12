import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "حریم خصوصی",
  description: "سیاست حریم خصوصی فروشگاه 3DMorty.",
}

export default function PrivacyPolicyPage() {
  return (
    <article className="content-container mx-auto max-w-3xl py-12 small:py-20">
      <h1 className="hd-section-title">حریم خصوصی</h1>
      <div className="mt-6 space-y-6 rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-white/70 p-6 text-sm leading-8 text-[var(--color-text-secondary)] small:p-9">
        <section>
          <h2 className="text-base font-bold text-[var(--color-ink)]">اطلاعاتی که دریافت می‌کنیم</h2>
          <p>برای ثبت سفارش و پشتیبانی، اطلاعاتی مانند نام، راه ارتباطی، نشانی ارسال و جزئیات سفارش را فقط در حد نیاز دریافت می‌کنیم.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-[var(--color-ink)]">نحوه استفاده از اطلاعات</h2>
          <p>اطلاعات شما برای پردازش سفارش، ارسال کالا، پاسخ‌گویی و بهبود تجربه خرید استفاده می‌شود و بدون مبنای قانونی در اختیار اشخاص ثالث قرار نمی‌گیرد.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-[var(--color-ink)]">امنیت و درخواست‌ها</h2>
          <p>برای پرسش درباره داده‌های شخصی یا درخواست اصلاح و حذف اطلاعات، از راه‌های ارتباطی درج‌شده در صفحه تماس با ما استفاده کنید.</p>
        </section>
      </div>
    </article>
  )
}
