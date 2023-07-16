import { Outlet, RootRoute, Route, Router, RouterProvider } from '@tanstack/router'
import { Toaster } from 'react-hot-toast'

import { Dashboard, EmailVerification, Home, Login, PageNotFound, Pool, Pools, Verify } from 'pages'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { z } from 'zod'
import { Guest, User } from './roles'
import { useEffect } from 'react'
import { useAuth } from '@redux/hooks'
import axios from 'axios'
import { useSocketIO } from 'hooks/useSocketIO'

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

const poolRoute = new Route({
   getParentRoute: () => rootRoute,
   path: '/pool/$id',
   component: Pool,
})

const poolsRoute = new Route({
   getParentRoute: () => rootRoute,
   path: '/pools',
   component: Pools,
})

const pageNotFound = new Route({
   getParentRoute: () => rootRoute,
   path: '*',
   component: PageNotFound,
})

const routeTree = rootRoute.addChildren([
   homeRoute,
   loginRoute,
   dashboardRoute,
   verifyRoute,
   emailVerificationRoute,
   poolsRoute,
   poolRoute,
   pageNotFound,
])

const router = new Router({ routeTree })

export const App = () => {
   const { setIsAuthenticated } = useAuth()

   useSocketIO()

   useEffect(() => {
      const fetchAuthStatus = async () => {
         try {
            const response = await axios.get<{ isAuthenticated: boolean }>('/api/auth')
            setIsAuthenticated(response.data.isAuthenticated)
         } catch (error: any) {
            if (error.response.status === 404) {
               return false
            }
         }
      }
      fetchAuthStatus()
   }, [])

   return (
      <div className="flex flex-col h-full">
         <Toaster position="bottom-right" reverseOrder={false} />
         <div className="flex-grow">
            <Navbar />
            <RouterProvider router={router} />
         </div>
         <Footer />
      </div>
   )
}

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
