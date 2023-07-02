import { Outlet, RootRoute, Route, Router, RouterProvider } from '@tanstack/router'
import { Home, Login } from 'pages'
import { Navbar } from './navbar'
import { Footer } from './footer'

const rootRoute = new RootRoute({ component: () => <Outlet /> })

const homeRoute = new Route({
   getParentRoute: () => rootRoute,
   path: '/',
   component: Home,
})

const loginRoute = new Route({
   getParentRoute: () => rootRoute,
   path: '/login',
   component: Login,
})

const routeTree = rootRoute.addChildren([homeRoute, loginRoute])

const router = new Router({ routeTree })

export const App = () => {
   return (
      <div className="flex flex-col h-full">
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
