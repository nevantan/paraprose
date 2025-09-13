import React from 'react'
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router'
import { queryClient } from './lib/api'
import { QueryClientProvider } from '@tanstack/react-query'

// Pages
import { StoriesPage } from './pages/StoriesPage'
import { StoryPage } from './pages/StoryPage'
import { AuthPage } from './pages/AuthPage'
import { WritePage } from './pages/WritePage'

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <div id="app-outlet">
        <Outlet />
      </div>
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StoriesPage,
})

const storyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/story/$storyId',
  component: StoryPage,
})

const writeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/write/$chapterId',
  component: WritePage,
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  storyRoute,
  writeRoute,
  authRoute,
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
