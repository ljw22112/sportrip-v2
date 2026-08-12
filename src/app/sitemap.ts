import { MetadataRoute } from 'next';
import { EVENTS } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://sportrip-v2.vercel.app';
  const staticPages = [
    { url: base, priority: 1.0 },
    { url: `${base}/events`, priority: 0.9 },
    { url: `${base}/calendar`, priority: 0.8 },
    { url: `${base}/saved`, priority: 0.6 },
    { url: `${base}/about`, priority: 0.7 },
  ].map(p => ({...p, lastModified: new Date(), changeFrequency: 'weekly' as const }));

  const eventPages = EVENTS.map(e => ({
    url: `${base}/events/${e.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...eventPages];
}
