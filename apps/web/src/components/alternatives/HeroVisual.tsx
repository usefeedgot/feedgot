import Image from 'next/image'
import { Container } from '@/components/global/container'

export function HeroVisual({ image, alt }: { image?: string; alt: string }) {
  if (!image) return null
  return (
    <Container maxWidth="6xl" className="px-4 sm:px-16 lg:px-20 xl:px-24">
      <div className="mt-8">
        <div className="rounded-lg border border-border bg-muted/30 p-2">
          <div className="relative overflow-hidden rounded-md">
            <Image
              src={image}
              alt={alt}
              width={1200}
              height={720}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </Container>
  )
}