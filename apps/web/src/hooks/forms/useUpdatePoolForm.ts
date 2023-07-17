import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from './useForm'
import { z } from 'zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { type PoolUpdate } from 'types'
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

   expiresAt: z
      .string()
      .refine(
         value => {
            const date = new Date(value)
            return isDateAtLeast10MinutesAhead(date)
         },
         { message: 'Invalid date. Set a date at least 10 minutes ahead' }
      )
      .refine(
         value => {
            const date = new Date(value)
            return date.getFullYear() <= new Date().getFullYear()
         },
         { message: 'Invalid date. Set a date not later than the current year' }
      ),

   answers: z.string().refine(
      value => {
         const answers = value.split(',')
         const answerCount = answers.length
         const areAnswersValid = answers.every(answer => answer.trim().length >= 3)
         return answerCount >= 2 && answerCount <= 5 && areAnswersValid
      },
      { message: 'Answer requires 3 words and 2-5 answers' }
   ),

   isPublic: z.enum(['PRIVATE', 'PUBLIC'], {
      errorMap: (_issue, _ctx) => ({ message: 'Choose private or public for pool type' }),
   }),
})

type UseUpdatePoolFormProps = {
   id: string
}

export const useUpdatePoolForm = ({ id }: UseUpdatePoolFormProps) => {
   const { submit, setValue, register, errors, watch } = useForm(createPoolSchema)

   const { closeModal } = useModal()

   const client = useQueryClient()

   const { mutate, isLoading } = useMutation({
      mutationFn: (data: PoolUpdate) => axios.put(`/api/pool/${data.id}`, data),
      onSuccess: () => {
         client.invalidateQueries(['userPools'])
         toast.success('Pool updated')
         closeModal('updatePoolModal')
      },
      onError: () => {
         toast.error('Someting went wrong,try again')
      },
   })

   const updatePool = submit(pool => {
      const answersToArray = pool.answers.split(',').map(answer => answer.trim())
      const expiresAtToDate = new Date(pool.expiresAt)
      const isPublicToBool = pool.isPublic === 'PUBLIC'

      mutate({
         ...pool,
         id,
         answers: answersToArray,
         expiresAt: expiresAtToDate,
         isPublic: isPublicToBool,
      })
   })

   return {
      updatePool,
      isLoading,
      register,
      setValue,
      errors,
      watch,
   }
}
