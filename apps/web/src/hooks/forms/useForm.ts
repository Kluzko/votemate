import { zodResolver } from '@hookform/resolvers/zod'
import { useForm as useHookForm } from 'react-hook-form'
import { type z } from 'zod'

export const useForm = <TSchema extends z.ZodSchema>(schema: TSchema) => {
   const {
      register,
      handleSubmit: submit,
      control,
      watch,
      setValue,
      getValues,
      reset,
      formState: { errors },
      clearErrors,
   } = useHookForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
   return {
      register,
      submit,
      control,
      watch,
      setValue,
      getValues,
      reset,
      errors,
      clearErrors,
   }
}
