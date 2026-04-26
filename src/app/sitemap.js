import { getAllSeoParams } from '../data/seoPages';

export default function sitemap() {
  const base = 'https://jetx.vip';
  const now = new Date().toISOString();

  const corePages = [
    { url: base,                       lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/about`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/services`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/fleet`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/empty-legs`,       lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/ambulance`,        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/quote`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/special-offers`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
  ];

  const seoPages = getAllSeoParams().map(({ lang, slug }) => ({
    url: `${base}/${lang}/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...corePages, ...seoPages];
}
