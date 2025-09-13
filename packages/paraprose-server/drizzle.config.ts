import { z } from 'zod'
import { defineConfig } from 'drizzle-kit'

const dbUrl = z.url().parse(process.env.DATABASE_URL)

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
})
