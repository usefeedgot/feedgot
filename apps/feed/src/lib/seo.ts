import type { Metadata } from 'next'
import { SITE_URL, DEFAULT_OG_IMAGE, DEFAULT_TITLE } from '@/config/seo'

function normalizePath(path?: string) {
  if (!path) return '/'
  return path.startsWith('/') ? path : `/${path}`
}

export function pageUrl(path?: string) {
  const p = normalizePath(path)
  return `${SITE_URL}${p}`
}

type BaseMetaArgs = {
  title: string
  description: string
  path?: string
  image?: string
  absoluteTitle?: boolean
  indexable?: boolean
  baseUrl?: string
}

export function createPageMetadata({ title, description, path, image, absoluteTitle, indexable, baseUrl }: BaseMetaArgs): Metadata {
  const img = image || DEFAULT_OG_IMAGE
  const canonical = normalizePath(path || '/')
  const brand = DEFAULT_TITLE || 'Feedgot'
  const hasBrand = typeof title === 'string' && title.includes(brand)
  const finalTitle = hasBrand ? title : `${title} - ${brand}`
  const base = baseUrl || SITE_URL
  const fullUrl = `${base}${canonical}`
  const useAbsolute = absoluteTitle !== false
  const titleProp: Metadata['title'] = useAbsolute ? { absolute: finalTitle } : finalTitle
  return {
    title: titleProp,
    description,
    alternates: { canonical: baseUrl ? fullUrl : canonical },
    ...(indexable === false ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      url: fullUrl,
      type: 'website',
      title: finalTitle,
      description,
      images: [{ url: img, width: 1200, height: 630, alt: finalTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description,
      images: [img],
    },
  }
}

export function createArticleMetadata({ title, description, path, image, absoluteTitle }: BaseMetaArgs): Metadata {
  const img = image || DEFAULT_OG_IMAGE
  const canonical = normalizePath(path || '/')
  const titleProp: Metadata['title'] = absoluteTitle ? { absolute: title } : title
  return {
    title: titleProp,
    description,
    alternates: { canonical },
    openGraph: {
      url: pageUrl(path || '/'),
      type: 'article',
      title,
      description,
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [img],
    },
  }
}