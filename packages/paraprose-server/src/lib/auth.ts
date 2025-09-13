import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db'
import { magicLink } from 'better-auth/plugins'
import {
  accountTable,
  sessionTable,
  userTable,
  verificationTable,
} from '../db/schema/auth'
import { createMiddleware } from 'hono/factory'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseUrl: process.env.BETTER_AUTH_URL!,
  trustedOrigins: ['http://localhost:5173'],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        console.log('Magic link:', url)
      },
    }),
  ],
})

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>

export const protect = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession(c.req.raw)

  if (!session) {
    return c.json({ message: 'Unauthorized' }, 401)
  }

  c.set('session', session)

  await next()
})
