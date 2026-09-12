import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "شرایط استفاده",
  description: "شرایط استفاده از فروشگاه 3DMorty.",
}

export default function TermsOfUsePage() {
  return (
    <article className="content-container mx-auto max-w-3xl py-12 small:py-20">
      <h1 className="hd-section-title">شرایط استفاده</h1>
      <div className="mt-6 space-y-6 rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-white/70 p-6 text-sm leading-8 text-[var(--color-text-secondary)] small:p-9">
        <section>
          <h2 className="text-base font-bold text-[var(--color-ink)]">ثبت سفارش</h2>
          <p>ثبت سفارش پس از تأیید اطلاعات، موجودی و پرداخت معتبر نهایی می‌شود. قیمت، هزینه ارسال و تخفیف‌های قابل‌اعمال پیش از ثبت نهایی سفارش نمایش داده می‌شوند.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-[var(--color-ink)]">ارسال و پشتیبانی</h2>
          <p>زمان و روش ارسال به نشانی و گزینه ارسال انتخاب‌شده بستگی دارد. در صورت نیاز به پیگیری، شماره سفارش را از بخش حساب کاربری در اختیار پشتیبانی قرار دهید.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-[var(--color-ink)]">تغییرات شرایط</h2>
          <p>ممکن است این شرایط برای هماهنگی با قوانین یا خدمات فروشگاه به‌روزرسانی شوند. ادامه استفاده از سایت پس از انتشار نسخه جدید به‌معنای پذیرش آن است.</p>
        </section>
      </div>
    </article>
  )
}
