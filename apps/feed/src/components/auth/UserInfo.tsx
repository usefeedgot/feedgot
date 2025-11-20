"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@feedgot/auth/client"
import { Button } from "@feedgot/ui/components/button"
import { Avatar, AvatarImage, AvatarFallback } from "@feedgot/ui/components/avatar"
import { getDisplayUser, getInitials } from "@/utils/user-utils"

export default function UserInfo() {
  const router = useRouter()
  const session = authClient.useSession()
  const [loading, setLoading] = useState(false)

  const user = getDisplayUser(session?.data?.user)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await authClient.signOut()
      router.push("/auth/sign-in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user.name}</span>
        {user.email ? <span className="text-xs text-muted-foreground">{user.email}</span> : null}
      </div>
      <Button size="sm" onClick={handleSignOut} disabled={loading}>
        {loading ? "Signing out..." : "Sign out"}
      </Button>
    </div>
  )
}