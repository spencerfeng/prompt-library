import { drizzle } from "drizzle-orm/better-sqlite3"
import { relations } from "./relations"

export const db = drizzle(process.env.DATABASE_URL ?? "./local.db", { relations })
