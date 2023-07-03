import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const logoutUser = async () => axios.post('/api/logout')

export const useLogout = () => {
   const client = useQueryClient()
   const { mutate: logout } = useMutation(logoutUser, {
      onSuccess: () => {
         client.invalidateQueries(['authStatus'])
         return window.navigate({ to: '/' })
      },
      onError: error => console.log(error),
   })

   return { logout }
}
