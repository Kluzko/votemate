import { z } from 'zod'
import { useForm } from './useForm'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const votePoolSchema = z.object({
   answerId: z.string({ errorMap: (_issue, _ctx) => ({ message: 'You need to choose an answer to vote.' }) }),
})

export const useVotePoolForm = ({ poolId }: { poolId: string | undefined }) => {
   const { submit, register, errors } = useForm(votePoolSchema)

   const { mutate, isLoading } = useMutation(async (voteData: { poolId: string; answerId: string }) => {
      try {
         const response = await axios.post('/api/vote', voteData)
         return response.data
      } catch (error: any) {
         console.log(error.response)
         if (error.response && error.response.data === 'You can only vote once on the same answer.') {
            toast.error(error.response.data)
         }
         throw error
      }
   })
   const votePool = submit(vote => {
      if (poolId) {
         mutate({
            answerId: vote.answerId,
            poolId,
         })
      }
   })

   return {
      votePool,
      register,
      errors,
      isLoading,
   }
}
