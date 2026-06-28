import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://irisify.me',                   lastModified: new Date(), changeFrequency: 'weekly',  priority: 1   },
    { url: 'https://irisify.me/order',              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://irisify.me/upload',             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://irisify.me/gift/anniversary',   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://irisify.me/gift/valentines',    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://irisify.me/gift/new-baby',      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://irisify.me/gift/mothers-day',   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://irisify.me/faq',                lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://irisify.me/privacy',            lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: 'https://irisify.me/terms',              lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
