import { z } from 'zod'
import { drizzle } from 'drizzle-orm/node-postgres'

const dbUrl = z.url().parse(process.env.DATABASE_URL)

export const db = drizzle(dbUrl)
