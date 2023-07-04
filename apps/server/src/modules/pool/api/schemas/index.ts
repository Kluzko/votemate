import { z } from 'zod'

const MAX_QUESTION_LENGTH = 100
const MIN_QUESTION_LENGTH = 4
// TODO: if isPublic == true user
// can provide password if isPublic false it is required with min of 8 chars
export const createPoolSchema = z.object({
   question: z.string().min(MIN_QUESTION_LENGTH).max(MAX_QUESTION_LENGTH),
   expiresAt: z.coerce.date(),
   answers: z.array(z.string()),
   isPublic: z.boolean(),
   password: z.string().optional(),
})

export type CreatePool = z.infer<typeof createPoolSchema>

export const poolIdSchema = z.object({ id: z.string() })

export type PoolId = z.infer<typeof poolIdSchema>

export const updatePoolSchema = z
   .object({
      question: z.string().min(MIN_QUESTION_LENGTH).max(MAX_QUESTION_LENGTH).optional(),
      expiresAt: z.coerce.date().optional(),
      answers: z.array(z.string()),
      isPublic: z.boolean().optional(),
      password: z.string().optional(),
   })
   .refine(value => Object.keys(value).length > 0, { message: 'At least one property must be present in the object' })
// values are optional but in object cant be empty
export type UpdatePool = z.infer<typeof updatePoolSchema> & PoolId

export const PoolSchema = z.object({
   id: z.string(),
   question: z.string().min(MIN_QUESTION_LENGTH).max(MAX_QUESTION_LENGTH),
   expiresAt: z.coerce.date(),
   answers: z.string().array(),
   isPublic: z.boolean(),
   password: z.string().optional(),
})

export type PoolData = z.infer<typeof PoolSchema>
