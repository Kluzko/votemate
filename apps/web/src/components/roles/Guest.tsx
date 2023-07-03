import { useAuth } from 'hooks'
import { useEffect, type ReactNode } from 'react'

type GuestProps = {
   children: ReactNode
}

export const Guest = ({ children }: GuestProps) => {
   const { isAuthenticated } = useAuth()

   useEffect(() => {
      if (isAuthenticated) {
         window.navigate({ to: '/dashboard' })
      }
   }, [isAuthenticated])

   return <>{children}</>
}
