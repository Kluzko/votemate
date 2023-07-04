import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const logoutUser = async () => axios.post('/api/logout')

export const useLogout = () => {
   const client = useQueryClient()
   const { mutate: logout } = useMutation(logoutUser, {
      onMutate: async () => {
         // Snapshot the previous value
         const previousAuthStatus = client.getQueryData(['authStatus'])

         // Optimistically update to the new value
         client.setQueryData(['authStatus'], false)

         // Return the snapshotted value
         return { previousAuthStatus }
      },
      onError: (error, _variables, context) => {
         toast.error('Someting went wrong,try again')
         // If the mutation fails, rollback to the previous value
         if (context?.previousAuthStatus) {
            client.setQueryData(['authStatus'], context.previousAuthStatus)
         }
      },
      onSuccess: () => {
         // Invalidate the query to refetch it
         client.invalidateQueries(['authStatus'])
         return window.navigate({ to: '/' })
      },
   })

   return { logout }
}
