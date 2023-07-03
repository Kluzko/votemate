import { Outlet, RootRoute, Route, Router, RouterProvider } from '@tanstack/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Dashboard, EmailVerification, Home, Login, Verify } from 'pages'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { z } from 'zod'
import { Guest, User } from './roles'

const rootRoute = new RootRoute({ component: () => <Outlet /> })

const homeRoute = new Route({
   getParentRoute: () => rootRoute,
   path: '/',
   component: Home,
})

const loginRoute = new Route({
   getParentRoute: () => rootRoute,
   path: '/login',
   component: () => (
      <Guest>
         <Login />
      </Guest>
   ),
})

const dashboardRoute = new Route({
   getParentRoute: () => rootRoute,
   path: '/dashboard',
   component: () => (
      <User>
         <Dashboard />
      </User>
   ),
})

const verifyRoute = new Route({
   getParentRoute: () => rootRoute,
   path: '/verify',
   component: Verify,
   validateSearch: z.object({ emailToken: z.string().optional() }),
})

const emailVerificationRoute = new Route({
   getParentRoute: () => rootRoute,
   path: '/emailVerification',
   component: () => (
      <Guest>
         <EmailVerification />
      </Guest>
   ),
})

const routeTree = rootRoute.addChildren([homeRoute, loginRoute, dashboardRoute, verifyRoute, emailVerificationRoute])

const router = new Router({ routeTree })

const queryClient = new QueryClient()

export const App = () => (
   <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-full">
         <div className="flex-grow">
            <Navbar />
            <RouterProvider router={router} />
         </div>
         <Footer />
      </div>
   </QueryClientProvider>
)

window.navigate = router.navigate

declare module '@tanstack/router' {
   interface Register {
      router: typeof router
   }
}

declare global {
   interface Window {
      navigate: typeof router.navigate
   }
}
