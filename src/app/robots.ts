import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Using localhost for now, replace with actual production URL later
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/auth/login', '/auth/signup', '/pricing'],
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
