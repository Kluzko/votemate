import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from './useForm'
import { z } from 'zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { type PoolWithoutId } from 'types'
import { useModal } from '@redux/hooks'

function isDateAtLeast10MinutesAhead(date: Date) {
   const futureDate = new Date()
   futureDate.setMinutes(futureDate.getMinutes() + 9)
   return date >= futureDate
}

const createPoolSchema = z.object({
   question: z
      .string()
      .min(4, 'Question must contain at leat 4 characters')
      .max(100, 'Question can`t contain more than 100 characters'),

   expiresAt: z.coerce
      .date()
      .refine(value => isDateAtLeast10MinutesAhead(value), { message: 'Set date at least 10 minutes ahead' })
      .refine(value => value.getFullYear() <= new Date().getFullYear(), {
         message: 'Set date not later than the current year',
      }),

   answers: z.string().refine(
      value => {
         const answers = value.split(',')
         const answerCount = answers.length
         const areAnswersValid = answers.every(answer => answer.trim().length >= 3)
         return answerCount >= 2 && answerCount <= 5 && areAnswersValid
      },
      { message: 'Answer requires 3 words and 2-5 answers' }
   ),

   isPublic: z
      .enum(['PRIVATE', 'PUBLIC'], {
         errorMap: (_issue, _ctx) => ({ message: 'Choose private or public for pool type' }),
      })
      .transform(data => data === 'PUBLIC'),
})

export const useCreatePoolForm = () => {
   const { submit, register, errors, watch } = useForm(createPoolSchema)
   const { closeModal } = useModal()

   const client = useQueryClient()

   const { mutate, isLoading } = useMutation({
      mutationFn: (data: PoolWithoutId) => axios.post('/api/pool', data),
      onSuccess: () => {
         client.invalidateQueries(['userPools'])
         toast.success('Pool created')
         closeModal('createPoolModal')
      },
      onError: () => {
         toast.error('Someting went wrong,try again')
      },
   })

   const createPool = submit(pool => {
      const answersToArray = pool.answers.split(',').map(answer => answer.trim())

      mutate({
         ...pool,
         answers: answersToArray,
      })
   })

   return {
      createPool,
      isLoading,
      register,
      errors,
      watch,
   }
}
