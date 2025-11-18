import { createAppRouter } from "@feedgot/api"
import { db } from "@feedgot/db"
import { auth } from "@feedgot/auth/auth"
import { headers } from "next/headers"
import { handle } from "hono/vercel"

const appRouter = createAppRouter({ db, auth, getHeaders: headers })

export const GET = handle(appRouter.handler)
export const POST = handle(appRouter.handler)

