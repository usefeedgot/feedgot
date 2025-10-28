import type { NavigationItem } from './homeNav'

export interface FooterNavGroup {
  title: string
  items: NavigationItem[]
}

export interface FooterNavigationConfig {
  groups: FooterNavGroup[]
}

export const footerNavigationConfig: FooterNavigationConfig = {
  groups: [
    {
      title: 'Product',
      items: [
        { name: 'Pricing', href: '/pricing' },
        { name: 'Docs', href: '/docs' },
        { name: 'Status page', href: '#' },
      ],
    },
    {
      title: 'Company',
      items: [
        { name: 'About us', href: '#' },
      ],
    },
    {
      title: 'Solutions',
      items: [
        { name: 'Website visitor tracking', href: '#' },
        { name: 'Shopify analytics', href: '#' },
      ],
    },
    {
      title: 'Compare',
      items: [
        { name: 'Google Analytics', href: '#' },
        { name: 'PostHog', href: '#' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { name: 'Blog', href: '/blog' },
        { name: 'Terms & definitions', href: '#' },
      ],
    },
    {
      title: 'Contact us',
      items: [
        { name: 'Email', href: '#' },
        { name: 'Live chat', href: '#' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { name: 'Terms & conditions', href: '#' },
        { name: 'Privacy', href: '#' },
        { name: 'GDPR', href: '#' },
      ],
    },
  ],
}