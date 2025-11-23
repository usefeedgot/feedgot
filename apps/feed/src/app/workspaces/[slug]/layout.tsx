import { Container } from "@/components/container"
import Sidebar from "@/components/sidebar/Sidebar"

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="min-h-screen flex gap-6" maxWidth="8xl">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </Container>
  )
}
