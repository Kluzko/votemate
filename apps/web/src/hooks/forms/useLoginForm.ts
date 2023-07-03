import { useLogin } from 'hooks/useLogin'
import { useForm } from './useForm'
import validator from 'validator'
import { z } from 'zod'

const loginSchema = z.object({
   email: z
      .string()
      .email({ message: 'Enter a valid email address' })
      .transform(email => validator.normalizeEmail(email) as string),
})

export const useLoginForm = () => {
   const { submit, register, errors, watch } = useForm(loginSchema)

   return {
      login: submit(data => useLogin(data.email)),
      register,
      errors,
      watch,
   }
}
