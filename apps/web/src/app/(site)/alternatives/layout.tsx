export default function AlternativesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Shared layout for all /alternatives pages. Keeps future sections consistent.
  return <>{children}</>
}