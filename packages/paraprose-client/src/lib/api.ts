import { QueryClient } from '@tanstack/react-query'
import { hc } from 'hono/client'
import type { AppType } from 'paraprose-server'

export const queryClient = new QueryClient()

export const client = hc<AppType>('http://localhost:3000/', {
  init: {
    credentials: 'include',
  },
}).api
