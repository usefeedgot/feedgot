// export { auth } from "./auth"
// export type { AuthServer } from "./auth"
// export {
//   authClient,
//   signUp,
//   signIn,
//   signOut,
//   useSession,
//   getSession,
//   organization,
//   useListOrganizations,
//   useActiveOrganization,
// } from "./client"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === "production" 
    ? "https://feedgot.com" // Replace with your production domain
    : "http://localhost:3000",
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient