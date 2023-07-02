import { Outlet, RootRoute, Route, Router, RouterProvider } from '@tanstack/router'
import { Home } from 'pages'
import { Navbar } from './navbar'

const rootRoute = new RootRoute({ component: () => <Outlet /> })

const homeRoute = new Route({
   getParentRoute: () => rootRoute,
   path: '/',
   component: Home,
})

const routeTree = rootRoute.addChildren([homeRoute])

const router = new Router({ routeTree })

export const App = () => {
   return (
      <div className="flex flex-col h-full">
         <div className="flex-grow">
            <Navbar />
            <RouterProvider router={router} />
         </div>
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
