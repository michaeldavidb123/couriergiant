import Link from 'next/link';
import {
  CheckCircle2,
  ArrowUpRight,
  Package,
  MapPin,
  ScanLine,
  Zap,
  Truck,
  Globe,
  Shield,
  Clock,
  Users,
  BarChart3,
  Headphones,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import { MktContainer, MktSection, MktEyebrow, MktCTA, MktBtn } from '@/components/marketing/MarketingUI';
import { Reveal } from '@/components/marketing/ScrollReveal';
import type { PageSection } from '@/lib/page-content';
import { SERVICES } from '@/lib/site-config';

const ICONS: Record<string, LucideIcon> = {
  package: Package,
  map: MapPin,
  scan: ScanLine,
  zap: Zap,
  truck: Truck,
  globe: Globe,
  shield: Shield,
  clock: Clock,
  users: Users,
  chart: BarChart3,
  support: Headphones,
  building: Building2,
  check: CheckCircle2,
};

function sectionBg(index: number, muted?: boolean) {
  if (muted) return 'bg-[var(--mk-surface)]';
  return index % 2 === 0 ? 'bg-white' : 'bg-[var(--mk-surface)]';
}

function SectionIntro({ section }: { section: Extract<PageSection, { type: 'intro' }> }) {
  return (
    <div className={`text-center max-w-2xl mx-auto space-y-3 ${section.align === 'left' ? 'text-left mx-0' : ''}`}>
      {section.eyebrow && <MktEyebrow>{section.eyebrow}</MktEyebrow>}
      <h2 className="mk-headline-sm">{section.title}</h2>
      {section.description && <p className="mk-lead mx-auto">{section.description}</p>}
    </div>
  );
}

export function PageSections({ sections, startIndex = 0 }: { sections: PageSection[]; startIndex?: number }) {
  return (
    <>
      {sections.map((section, i) => {
        const idx = startIndex + i;
        const bg = sectionBg(idx, section.type === 'split' ? section.muted : undefined);

        if (section.type === 'cta') {
          return (
            <Reveal key={section.title} variant="zoom-in">
              <MktCTA
                title={section.title}
                description={section.description}
                primaryCta={section.primaryCta}
                primaryHref={section.primaryHref}
                secondaryCta={section.secondaryCta}
                secondaryHref={section.secondaryHref}
              />
            </Reveal>
          );
        }

        const revealVariant = idx % 3 === 1 ? 'fade-right' : idx % 3 === 2 ? 'fade-left' : 'fade-up';

        return (
          <MktSection key={`${section.type}-${i}`} className={bg} tight={section.tight}>
            <Reveal variant={revealVariant as 'fade-up' | 'fade-right' | 'fade-left'}>
            <MktContainer className="space-y-8">
              {section.type === 'intro' && <SectionIntro section={section} />}

              {section.type === 'features' && (
                <>
                  {(section.eyebrow || section.title) && (
                    <SectionIntro
                      section={{
                        type: 'intro',
                        eyebrow: section.eyebrow,
                        title: section.title,
                        description: section.description,
                      }}
                    />
                  )}
                  <div
                    className={`grid gap-4 ${
                      section.columns === 4
                        ? 'sm:grid-cols-2 lg:grid-cols-4'
                        : section.columns === 3
                          ? 'sm:grid-cols-2 lg:grid-cols-3'
                          : 'sm:grid-cols-2'
                    }`}
                  >
                    {section.items.map((item) => {
                      const Icon = item.icon ? ICONS[item.icon] : null;
                      return (
                        <article key={item.title} className="mk-card p-6 space-y-3">
                          {Icon && (
                            <div className="mk-process-card__icon w-10 h-10">
                              <Icon className="w-4 h-4" strokeWidth={1.5} />
                            </div>
                          )}
                          <h3 className="font-semibold text-sm tracking-tight">{item.title}</h3>
                          <p className="text-sm text-[#6b6b6b] leading-relaxed">{item.body}</p>
                          {item.bullets && (
                            <ul className="text-xs text-[#6b6b6b] space-y-1.5 pt-1">
                              {item.bullets.map((b) => (
                                <li key={b} className="flex gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-700" />
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </>
              )}

              {section.type === 'stats' && (
                <div className={`grid gap-4 sm:grid-cols-2 ${section.items.length > 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-4'}`}>
                  {section.items.map((item) => (
                    <div key={item.label} className="mk-card p-6 text-center space-y-1">
                      <div className="mk-stat-value">{item.value}</div>
                      <p className="text-sm text-[#6b6b6b]">{item.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'split' && (
                <div className="vr-split-banner">
                  {!section.imageRight && (
                    <img src={section.image} alt="" className="vr-split-banner__image" loading="lazy" />
                  )}
                  <div className="vr-split-banner__content">
                    {section.eyebrow && <MktEyebrow>{section.eyebrow}</MktEyebrow>}
                    <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
                    <p className="text-sm text-[#6b6b6b] leading-relaxed">{section.body}</p>
                    {section.bullets && (
                      <ul className="text-sm text-[#6b6b6b] space-y-2 pt-1">
                        {section.bullets.map((b) => (
                          <li key={b} className="flex gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-700" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.ctaHref && section.ctaLabel && (
                      <MktBtn href={section.ctaHref} className="!mt-2">{section.ctaLabel}</MktBtn>
                    )}
                  </div>
                  {section.imageRight && (
                    <img src={section.image} alt="" className="vr-split-banner__image" loading="lazy" />
                  )}
                </div>
              )}

              {section.type === 'steps' && (
                <>
                  <SectionIntro
                    section={{
                      type: 'intro',
                      eyebrow: section.eyebrow,
                      title: section.title,
                      description: section.description,
                    }}
                  />
                  <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {section.items.map((step, n) => (
                      <li key={step.title} className="mk-card p-5 space-y-2">
                        <span className="text-xs font-mono font-semibold text-[#6b6b6b]">0{n + 1}</span>
                        <h3 className="font-semibold text-sm">{step.title}</h3>
                        <p className="text-xs text-[#6b6b6b] leading-relaxed">{step.body}</p>
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {section.type === 'services' && (
                <>
                  {(section.eyebrow || section.title) && (
                    <SectionIntro
                      section={{
                        type: 'intro',
                        eyebrow: section.eyebrow,
                        title: section.title ?? '',
                        description: section.description,
                      }}
                    />
                  )}
                  <div className="grid md:grid-cols-2 gap-5">
                    {SERVICES.map((s) => {
                      const card = (
                        <>
                          <img src={s.image} alt="" className="vr-media-card__image" loading="lazy" />
                          <div className="vr-media-card__body space-y-3">
                            <h2 className="text-xl font-semibold">{s.title}</h2>
                            <p className="text-sm text-[#6b6b6b] leading-relaxed">{s.longDescription ?? s.description}</p>
                            {s.bullets && (
                              <ul className="text-xs text-[#6b6b6b] space-y-1.5">
                                {s.bullets.map((b) => (
                                  <li key={b} className="flex gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-teal-700" />
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {section.linkCards && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6b6b6b] group-hover:text-[#111]">
                                Learn more <ArrowUpRight className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </>
                      );
                      return section.linkCards ? (
                        <Link key={s.id} href={`/services#${s.id}`} className="vr-media-card group scroll-mt-28">
                          {card}
                        </Link>
                      ) : (
                        <article key={s.id} id={s.id} className="vr-media-card scroll-mt-28">
                          {card}
                        </article>
                      );
                    })}
                  </div>
                </>
              )}

              {section.type === 'faq' && (
                <>
                  {section.title && (
                    <SectionIntro
                      section={{ type: 'intro', eyebrow: section.eyebrow, title: section.title, description: section.description }}
                    />
                  )}
                  <div className="max-w-3xl mx-auto space-y-3 w-full">
                    {section.items.map((faq) => (
                      <details key={faq.q} className="mk-card p-5 group">
                        <summary className="font-semibold cursor-pointer list-none flex justify-between gap-4 text-sm">
                          {faq.q}
                          <span className="text-[#6b6b6b] group-open:rotate-45 transition-transform">+</span>
                        </summary>
                        <p className="text-sm text-[#6b6b6b] leading-relaxed mt-3">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </>
              )}

              {section.type === 'legal' && (
                <div className="max-w-3xl mx-auto space-y-8 w-full">
                  {section.items.map((block) => (
                    <article key={block.heading} className="space-y-3">
                      <h2 className="text-lg font-semibold tracking-tight">{block.heading}</h2>
                      {block.paragraphs.map((p) => (
                        <p key={p.slice(0, 40)} className="text-sm text-[#6b6b6b] leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </article>
                  ))}
                </div>
              )}

              {section.type === 'jobs' && (
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  {section.image && (
                    <img src={section.image} alt="" className="w-full rounded-2xl object-cover aspect-video lg:aspect-[4/3]" loading="lazy" />
                  )}
                  <div className="space-y-3">
                    {section.items.map((job) => (
                      <div key={job.title} className="mk-card p-5 space-y-2">
                        <div className="flex flex-wrap justify-between gap-2">
                          <span className="font-medium">{job.title}</span>
                          <span className="text-xs text-[#6b6b6b]">{job.location}</span>
                        </div>
                        <p className="text-sm text-[#6b6b6b]">{job.team}</p>
                        <p className="text-xs text-[#6b6b6b] leading-relaxed">{job.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.type === 'testimonials' && (
                <>
                  <SectionIntro
                    section={{ type: 'intro', eyebrow: section.eyebrow, title: section.title, description: section.description }}
                  />
                  <div className="grid md:grid-cols-3 gap-4">
                    {section.items.map((t) => (
                      <blockquote key={t.author} className="mk-card p-6 space-y-4">
                        <p className="text-sm text-[#6b6b6b] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                        <footer>
                          <p className="text-sm font-semibold">{t.author}</p>
                          <p className="text-xs text-[#6b6b6b]">{t.role}</p>
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </>
              )}

              {section.type === 'contact-channels' && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {section.items.map((ch) => (
                    <div key={ch.title} className="mk-card p-5 space-y-2">
                      <h3 className="font-semibold text-sm">{ch.title}</h3>
                      <p className="text-xs text-[#6b6b6b] leading-relaxed">{ch.body}</p>
                      {ch.href && (
                        <Link href={ch.href} className="inline-flex items-center gap-1 text-xs font-medium hover:underline">
                          {ch.linkLabel} <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </MktContainer>
            </Reveal>
          </MktSection>
        );
      })}
    </>
  );
}