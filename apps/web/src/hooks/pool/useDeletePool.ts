import { useModal } from '@redux/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export const useDeletePool = () => {
   const client = useQueryClient()

   const { closeModal } = useModal()

   const { mutate, isLoading } = useMutation({
      mutationFn: (id: string) => axios.delete(`/api/pool/${id}`),
      onSuccess: () => {
         client.refetchQueries(['userPools'])
         toast.success('Pool deleted')
         closeModal('deletePoolModal')
      },
      onError: () => {
         toast.error('Someting went wrong,try again')
      },
   })

   return {
      deletePool: mutate,
      isLoading,
   }
}
