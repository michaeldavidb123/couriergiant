'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Zap,
  Truck,
  Globe,
  Package,
  Layers,
  ShoppingBag,
  Warehouse,
  Building2,
  HeartPulse,
  Plane,
  MapPin,
  HelpCircle,
  Mail,
  Calculator,
  FileText,
  Shield,
  Users,
  Headphones,
  Phone,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Logo from '@/components/Logo';
import { MktBtn } from '@/components/marketing/MarketingUI';
import LanguageTranslator from '@/components/marketing/LanguageTranslator';
import { NAV_ITEMS, UTILITY_NAV, type NavItem } from '@/lib/site-config';

const NAV_ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  truck: Truck,
  globe: Globe,
  package: Package,
  layers: Layers,
  shopping: ShoppingBag,
  warehouse: Warehouse,
  building: Building2,
  heart: HeartPulse,
  plane: Plane,
  map: MapPin,
  help: HelpCircle,
  mail: Mail,
  calculator: Calculator,
  file: FileText,
  shield: Shield,
  users: Users,
  headphones: Headphones,
};

function isNavActive(pathname: string, href: string) {
  const base = href.split('#')[0];
  if (!base) return false;
  if (base === '/') return pathname === '/';
  return pathname === base || pathname.startsWith(`${base}/`);
}

function NavDropdown({
  item,
  pathname,
  onNavigate,
}: {
  item: Extract<NavItem, { type: 'dropdown' }>;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = item.items.some((link) => isNavActive(pathname, link.href));

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div
      ref={ref}
      className="mk-nav-dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`mk-nav-dropdown__trigger ${isActive ? 'is-active' : ''}`}
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mk-nav-dropdown__panel">
          <div className="mk-nav-dropdown__panel-inner">
            {item.items.map((link) => {
              const Icon = link.icon ? NAV_ICONS[link.icon] : null;
              return (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="mk-nav-dropdown__link"
                >
                  {Icon && (
                    <span className="mk-nav-dropdown__link-icon" aria-hidden>
                      <Icon className="w-4 h-4" strokeWidth={1.75} />
                    </span>
                  )}
                  <span className="mk-nav-dropdown__link-body">
                    <span className="mk-nav-dropdown__link-title">{link.label}</span>
                    {link.description && (
                      <span className="mk-nav-dropdown__link-desc">{link.description}</span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function NavMobileSection({
  item,
  mobileSection,
  setMobileSection,
  setMobileOpen,
}: {
  item: Extract<NavItem, { type: 'dropdown' }>;
  mobileSection: string | null;
  setMobileSection: (value: string | null) => void;
  setMobileOpen: (value: boolean) => void;
}) {
  return (
    <div className="border-b border-[#e3e3e0]/80 last:border-0">
      <button
        type="button"
        onClick={() => setMobileSection(mobileSection === item.label ? null : item.label)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-[#111]"
      >
        {item.label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${mobileSection === item.label ? 'rotate-180' : ''}`}
        />
      </button>
      {mobileSection === item.label && (
        <div className="pb-3 pl-1 space-y-1">
          {item.items.map((link) => {
            const Icon = link.icon ? NAV_ICONS[link.icon] : null;
            return (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="mk-nav-dropdown__link mk-nav-dropdown__link--mobile"
              >
                {Icon && (
                  <span className="mk-nav-dropdown__link-icon" aria-hidden>
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                )}
                <span className="mk-nav-dropdown__link-body">
                  <span className="mk-nav-dropdown__link-title">{link.label}</span>
                  {link.description && (
                    <span className="mk-nav-dropdown__link-desc">{link.description}</span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.classList.remove('mk-mobile-nav-open');
      return;
    }

    document.body.classList.add('mk-mobile-nav-open');

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.classList.remove('mk-mobile-nav-open');
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSection(null);
  }, [pathname]);

  return (
    <header
      className="mk-nav-header marketing-site notranslate"
      data-mobile-theme-color="#f7f7f5"
    >
      <div className="vr-nav-utility hidden lg:block">
        <div className="mk-container flex items-center justify-between h-9 text-xs">
          <div className="flex items-center gap-4 text-[#6b6b6b]">
            {UTILITY_NAV.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 hover:text-[#111] transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className="hover:text-[#111] transition-colors">
                  {item.label}
                </Link>
              ),
            )}
          </div>
          <div className="flex items-center gap-4">
            <LanguageTranslator variant="utility" />
          </div>
        </div>
      </div>

      <div className="mk-container">
        <div className="flex items-center justify-between h-16 lg:h-[4.25rem] gap-4">
          <Logo />

          <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_ITEMS.map((item) =>
              item.type === 'dropdown' ? (
                <NavDropdown key={item.label} item={item} pathname={pathname} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mk-nav-link ${isNavActive(pathname, item.href) ? 'is-active' : ''}`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <MktBtn href="/tracking" variant="secondary" className="!py-2 !text-xs">
              Track
            </MktBtn>
            <MktBtn href="/quote" className="!py-2 !text-xs">
              Get a quote
            </MktBtn>
          </div>

          <div className="lg:hidden flex items-center gap-2 ml-auto">
            <LanguageTranslator variant="compact" />
            <button
              type="button"
              className="xl:hidden flex items-center gap-2 text-sm font-medium"
              onClick={() => {
                setMobileOpen((isOpen) => {
                  if (isOpen) setMobileSection(null);
                  return !isOpen;
                });
              }}
              aria-expanded={mobileOpen}
              aria-controls="mk-nav-mobile-panel"
            >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            Menu
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="mk-nav-mobile-backdrop xl:hidden"
            aria-label="Close menu"
            onClick={() => {
              setMobileOpen(false);
              setMobileSection(null);
            }}
          />
          <div
            id="mk-nav-mobile-panel"
            className="mk-nav-mobile-panel xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="mk-nav-mobile-panel__inner">
              <div className="pb-4 mb-4 border-b border-[#e3e3e0]">
                <LanguageTranslator variant="marketing" />
              </div>
              <div className="flex flex-wrap gap-3 pb-4 mb-4 border-b border-[#e3e3e0] text-xs">
                {UTILITY_NAV.map((item) =>
                  item.external ? (
                    <a key={item.label} href={item.href} className="text-[#6b6b6b] font-medium">
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-[#6b6b6b] font-medium"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </div>

              {NAV_ITEMS.map((item) =>
                item.type === 'dropdown' ? (
                  <NavMobileSection
                    key={item.label}
                    item={item}
                    mobileSection={mobileSection}
                    setMobileSection={setMobileSection}
                    setMobileOpen={setMobileOpen}
                  />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`mk-nav-mobile-link ${isNavActive(pathname, item.href) ? 'is-active' : ''}`}
                  >
                    {item.label}
                  </Link>
                ),
              )}

              <div className="mk-nav-mobile-panel__cta grid grid-cols-2 gap-2">
                <MktBtn
                  href="/tracking"
                  variant="secondary"
                  className="justify-center !text-xs"
                  onClick={() => setMobileOpen(false)}
                >
                  Track
                </MktBtn>
                <MktBtn href="/quote" className="justify-center !text-xs" onClick={() => setMobileOpen(false)}>
                  Get a quote
                </MktBtn>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
