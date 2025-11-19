import Verify from "@/components/auth/verify"
import { Suspense } from "react"

export default function VerifyPage() {
  return (
    <Suspense fallback={null}> 
      <Verify />
    </Suspense>
  )
}