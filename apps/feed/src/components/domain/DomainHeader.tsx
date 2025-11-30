import Link from "next/link"
import Image from "next/image"
import { Button } from "@feedgot/ui/components/button"
import { cn } from "@feedgot/ui/lib/utils"

type WorkspaceInfo = {
  id: string
  name: string
  slug: string
  domain: string | null
  logo: string | null
}

export function DomainHeader({ workspace, subdomain }: { workspace: WorkspaceInfo; subdomain: string }) {
  return (
    <header className={cn("flex items-center gap-6 py-6")}>      
      <div className="flex items-center gap-3">
        {workspace.logo ? (
          <Image src={workspace.logo} alt={workspace.name} width={28} height={28} className="rounded-sm object-cover" />
        ) : (
          <div className="h-7 w-7 rounded-sm bg-muted flex items-center justify-center text-xs font-semibold">
            {workspace.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="text-sm font-medium">{workspace.name}</div>
      </div>

      <nav className="flex-1">
        <ul className="flex items-center gap-4 text-sm">
          <li>
            <Link href={`/${subdomain}/${workspace.slug}`} className="hover:text-primary">Feedback</Link>
          </li>
          <li>
            <Link href={`/${subdomain}/${workspace.slug}/roadmap`} className="hover:text-primary">Roadmap</Link>
          </li>
          <li>
            <Link href={`/${subdomain}/${workspace.slug}/changelog`} className="hover:text-primary">Changelog</Link>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-3">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    </header>
  )
}

