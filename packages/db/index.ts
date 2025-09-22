import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"
import { neon } from "@neondatabase/serverless"

export const db = drizzle(neon(process.env.DATABASE_URL ?? ""), { schema })

// Export schema tables for Better Auth and application use
export const { user, session, account, verification, workspace, workspaceMember } = schema
