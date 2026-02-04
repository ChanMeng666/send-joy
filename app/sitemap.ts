import { MetadataRoute } from 'next'

const baseUrl = 'https://sendjoy.chanmeng-dev.workers.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/send`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/settings`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/templates/resend`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  // Preset template editor routes
  const presetTemplateIds = [
    'christmas-classic',
    'new-year-2025',
    'chinese-new-year',
    'birthday',
    'product-launch',
    'newsletter',
  ]

  const templateEditorRoutes: MetadataRoute.Sitemap = presetTemplateIds.map((id) => ({
    url: `${baseUrl}/templates/${id}/edit`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...templateEditorRoutes]
}
