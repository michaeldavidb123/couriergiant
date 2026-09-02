import Link from 'next/link';
import { FOOTER_LINKS, SITE } from '@/lib/site-config';
import Logo from '@/components/Logo';
import { MktBtn } from '@/components/marketing/MarketingUI';
import CookieSettingsButton from '@/components/marketing/CookieSettingsButton';

export default function Footer() {
  return (
    <footer className="mk-footer marketing-site mt-auto">
      <div className="mk-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-[#6b6b6b] max-w-xs leading-relaxed">{SITE.description}</p>
            <MktBtn href="/quote">Get a quote</MktBtn>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link href={link.href} className="text-sm text-[#6b6b6b] hover:text-[#111]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-[#e3e3e0] text-sm text-[#6b6b6b] flex flex-col sm:flex-row justify-between gap-3">
          <p>© {new Date().getFullYear()} {SITE.legalName}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <CookieSettingsButton className="hover:text-[#111] transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}
