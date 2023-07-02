import { useForm } from './useForm'
import { z } from 'zod'

function isDateAtLeast5MinutesAhead(date: Date) {
   const futureDate = new Date()
   futureDate.setMinutes(futureDate.getMinutes() + 4)
   return date >= futureDate
}

const createPoolSchema = z.object({
   question: z
      .string()
      .min(4, 'Question must contain at leat 4 characters')
      .max(100, 'Question can`t contain more than 100 characters'),
   expiresAt: z.coerce
      .date()
      .refine(value => isDateAtLeast5MinutesAhead(value), { message: 'Set date at least 5 minutes ahead' }),
   answers: z.string().refine(
      value => {
         const answers = value.split(',')
         const answerCount = answers.length
         const areAnswersValid = answers.every(answer => answer.trim().length >= 4)
         return answerCount >= 2 && answerCount <= 5 && areAnswersValid
      },
      { message: 'Answer requires 4 words and 2-5 answers' }
   ),
   poolType: z.enum(['PRIVATE', 'PUBLIC'], {
      errorMap: (_issue, _ctx) => ({ message: 'Choose private or public for pool type' }),
   }),
})

export const useCreatePoolForm = () => {
   const { submit, register, errors, watch } = useForm(createPoolSchema)

   return {
      createPool: submit(data => console.log(data)),
      register,
      errors,
      watch,
   }
}
