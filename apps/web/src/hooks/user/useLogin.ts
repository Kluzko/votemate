import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export const useLogin = () => {
   const { mutate, isLoading } = useMutation({
      mutationFn: (email: string) => axios.post('/api/login', { email }),
      onSuccess: () => {
         window.navigate({ to: '/emailVerification' })
      },
      onError: () => {
         toast.error('Someting went wrong. Please try agian.')
      },
   })

   return {
      mutate,
      isLoading,
   }
}
