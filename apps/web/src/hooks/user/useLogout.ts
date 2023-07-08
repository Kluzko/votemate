import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '@redux/hooks'

const logoutUser = async () => axios.post('/api/logout')

export const useLogout = () => {
   const { setIsAuthenticated } = useAuth()

   const { mutate: logout } = useMutation(logoutUser, {
      onError: () => {
         toast.error('Someting went wrong,try again')
      },
      onSuccess: () => {
         setIsAuthenticated(false)
         return window.navigate({ to: '/' })
      },
   })

   return { logout }
}
