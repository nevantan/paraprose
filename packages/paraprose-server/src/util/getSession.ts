import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { Session } from '../lib/auth'

export default function getSession(
  c: Context<any, any, {}>
): NonNullable<Session> {
  const { session } = c.var
  if (!session) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }
  return c.get('session')
}
