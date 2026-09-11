import Image from "next/image"
import { getLocale } from "@lib/data/locale-actions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BrandCube } from "@modules/common/components/brand-logo"

const footerGroups = [
  { title: "دسترسی سریع", links: [["صفحه اصلی", "/"], ["دسته‌بندی‌ها", "/collections"], ["محصولات", "/store"], ["تازه‌ها", "/store?sortBy=created_at"], ["تماس با ما", "/contact"]] },
  { title: "خدمات مشتریان", links: [["سوالات متداول", "/faq"], ["پیگیری سفارش", "/account/orders"], ["شرایط و قوانین", "/faq#shipping"], ["حریم خصوصی", "/faq"], ["بازگشت کالا", "/faq#returns"]] },
] as const

export default async function Footer() {
  const locale = await getLocale()
  const year = new Date().getFullYear().toLocaleString(!locale || locale.toLowerCase().startsWith("fa") ? "fa-IR" : "en-US", { useGrouping: false })

  return <footer id="site-footer" className="footer-violet pb-[calc(64px+env(safe-area-inset-bottom))] small:pb-0" dir="rtl">
    <div className="footer-newsletter"><div className="content-container footer-newsletter-inner">
      <span className="footer-envelope" aria-hidden="true"><MailIcon /></span>
      <div className="footer-newsletter-copy"><strong>از جدیدترین‌ها باخبر شوید!</strong><span>از محصولات تازه و پیشنهادهای محدود 3DMorty جا نمانید.</span></div>
      <form className="footer-subscribe" action="/contact"><input type="email" name="email" placeholder="ایمیل خود را وارد کنید" aria-label="ایمیل برای خبرنامه" /><button type="submit">عضویت</button></form>
      <div className="footer-newsletter-mascot" aria-hidden="true"><Image src="/images/3dmorty/mascot/morty-character-transparent-v2.png" alt="" fill quality={90} sizes="150px" /></div>
      <p className="footer-newsletter-note">به جمع طرفداران<br />3DMORTY بپیوندید!</p>
    </div></div>

    <div className="content-container footer-violet-main">
      <div className="footer-brand"><LocalizedClientLink href="/" aria-label="3DMorty" className="footer-brand-logo"><BrandCube /><span><b>3DMORTY</b><small>فراتر از تخیل، در دستان تو</small></span></LocalizedClientLink><p>هر ایده، یک اثر سه‌بعدی.<br />مرجع فیگور، دکوری و اکسسوری‌های خاص برای میز و ویترین شما.</p><SocialLinks /></div>
      {footerGroups.map((group) => <FooterColumn key={group.title} {...group} />)}
      <address className="footer-contact"><h2>با ما در تماس باشید</h2><a href="https://maps.google.com/?q=Tehran" target="_blank" rel="noreferrer">تهران، خیابان خلاقیت، پلاک ۱۲</a><a href="tel:+982112345678">۰۲۱-۱۲۳۴۵۶۷۸</a><a href="mailto:info@3dmorty.ir">info@3dmorty.ir</a></address>
    </div>
    <div className="footer-violet-legal"><div className="content-container"><span>تمامی حقوق برای 3DMORTY محفوظ است. {year}</span><span>با چاپ سه‌بعدی، دنیای بهتر و خلاقانه‌تر بسازیم. ♥</span></div></div>
  </footer>
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<readonly [string, string]> }) {
  return <div className="footer-violet-column"><h2>{title}</h2><ul>{links.map(([label, href]) => <li key={href}><LocalizedClientLink href={href}>{label}</LocalizedClientLink></li>)}</ul></div>
}

function SocialLinks() {
  return <div className="footer-violet-social" aria-label="شبکه‌های اجتماعی">
    <a href="#" aria-label="اینستاگرام"><InstagramIcon /></a>
    <a href="#" aria-label="تلگرام"><TelegramIcon /></a>
    <a href="#" aria-label="یوتیوب"><YoutubeIcon /></a>
    <a href="#" aria-label="پینترست"><PinterestIcon /></a>
  </div>
}

function IconFrame({ children }: { children: React.ReactNode }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
}

function MailIcon() {
  return <IconFrame><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4.5 7 7.5 5.8L19.5 7" /></IconFrame>
}

function InstagramIcon() {
  return <IconFrame><rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.7h.01" /></IconFrame>
}

function TelegramIcon() {
  return <IconFrame><path d="m21 3-3.1 17.2-6.1-5-3.6 3.4.6-5.1L19 5.1 6.1 11.2l-3.8-1.3L21 3Z" /><path d="m8.8 13.5 3 1.7" /></IconFrame>
}

function YoutubeIcon() {
  return <IconFrame><rect x="3" y="6.25" width="18" height="11.5" rx="3.5" /><path d="m10.25 9.6 4.5 2.4-4.5 2.4V9.6Z" fill="currentColor" stroke="none" /></IconFrame>
}

function PinterestIcon() {
  return <IconFrame><circle cx="12" cy="12" r="8.75" /><path d="M9.3 20.3c1.1-2.4 1.1-3.5 1.7-5.6-.9-.7-1.3-1.8-1.1-2.9.2-1.8 1.7-3.2 3.6-3.2 2.1 0 3.3 1.5 3.3 3.3 0 2.3-1.4 4-3.4 4-1 0-1.7-.8-1.5-1.8l.6-2.4" /></IconFrame>
}
