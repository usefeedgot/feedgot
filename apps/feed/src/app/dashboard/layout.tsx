import { redirect } from "next/navigation"
import { getServerSession } from "@feedgot/auth/session"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/auth/sign-in?redirect=/dashboard")
  }
  return <>{children}</>
}