import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site-config';

const PUBLIC_PATHS = [
  '/',
  '/tracking',
  '/quote',
  '/support',
  '/about',
  '/services',
  '/pricing',
  '/faq',
  '/contact',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, '');
  const lastModified = new Date();
  return PUBLIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
