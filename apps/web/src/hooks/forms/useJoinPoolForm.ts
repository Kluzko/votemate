import { useMutation } from '@tanstack/react-query'
import axios, { type AxiosError } from 'axios'
import { z } from 'zod'
import { useForm } from './useForm'
import { toast } from 'react-hot-toast'
import { type PoolWithTotalVotes } from 'types'

const joinPoolSchema = z.object({ poolId: z.string().uuid('Invalid poolId') })

export const useJoinPoolForm = () => {
   const { mutate, isLoading } = useMutation({
      mutationFn: async ({ poolId }: z.infer<typeof joinPoolSchema>) => {
         const response = await axios.get<{ pool: PoolWithTotalVotes }>(`/api/pool/${poolId}`)
         return response.data
      },
      onSuccess: ({ pool }) => {
         console.log(pool.id)
         window.navigate({
            to: '/pool/$id',
            params: { id: pool.id },
         })
      },
      onError: (error: AxiosError) => {
         if (error.response && error.response.status === 404) {
            return toast.error('Pool not found')
         }
         toast.error('Someting went wrong,try again')
      },
   })

   const { submit, register, errors, watch } = useForm(joinPoolSchema)

   return {
      joinPool: submit(({ poolId }) => mutate({ poolId })),
      isLoading,
      register,
      errors,
      watch,
   }
}
