import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "../db/schema"
import { neon } from "@neondatabase/serverless"

export const db = drizzle(neon(process.env.DATABASE_URL ?? ""), { schema })
