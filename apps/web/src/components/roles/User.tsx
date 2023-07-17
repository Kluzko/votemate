import { useAuth } from '@redux/hooks'
import { useEffect, type ReactNode } from 'react'

type UserProps = {
   children: ReactNode
}

export const User = ({ children }: UserProps) => {
   const { isAuthenticated } = useAuth()

   useEffect(() => {
      if (!isAuthenticated) {
         window.navigate({ to: '/login' })
      }
   }, [isAuthenticated])

   return <>{children}</>
}
