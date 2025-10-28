import Link from 'next/link'
import { Container } from './container'
import { Logo } from '@/components/logo'
import { footerNavigationConfig } from '@/config/footerNav'
import { GitHubIcon } from '@feedgot/ui/icons/github'
import { TwitterIcon } from '@feedgot/ui/icons/twitter'

export default function FooterSection() {
  return (
    <footer className="bg-background py-20 md:py-24">
      <Container maxWidth="6xl">
        <div className="grid items-start gap-16 md:grid-cols-6">
          {/* Brand & meta */}
          <div className="md:col-span-2">
            <Link href="/" aria-label="go home" className="inline-flex items-center gap-2">
              <Logo />
              <span className="text-sm font-medium">Feedgot</span>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              Made and hosted in EU.
            </p>
            <p className="text-zinc-500 mt-1 text-sm">
              Customer Feedback, {new Date().getFullYear()}.
            </p>
            <div className="mt-6 flex items-center gap-4 text-gray-400">
              {/* GitHub */}
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-foreground"
              >
                <GitHubIcon className="text-current" size={16} />
              </Link>
              {/* Twitter/X */}
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-foreground"
              >
                <TwitterIcon className="text-current" size={16} />
              </Link>
            </div>
          </div>

          {/* Navigation groups */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 md:col-span-4">
            {footerNavigationConfig.groups.map((group, index) => (
              <div key={index} className="space-y-4 text-sm">
                <span className="block font-bold">{group.title}</span>
                {group.items.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="text-zinc-500 hover:text-foreground block transition-colors"
                  >
                    {item.name === 'Status page' ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="bg-green-500 inline-block size-1.5 rounded-full" />
                        {item.name}
                      </span>
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}