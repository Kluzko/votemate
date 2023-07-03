import { z } from 'zod'

const MAX_QUESTION_LENGTH = 100
const MIN_QUESTION_LENGTH = 4

export const createPoolSchema = z
   .object({
      question: z.string().min(MIN_QUESTION_LENGTH).max(MAX_QUESTION_LENGTH),
      expiresAt: z.coerce.date(),
   })
   .strict()

export type CreatePool = z.infer<typeof createPoolSchema>

export const poolIdSchema = z.object({ id: z.string().transform(id => Number(id)) })

export type PoolId = z.infer<typeof poolIdSchema>

export const updatePoolSchema = z
   .object({
      question: z.string().min(MIN_QUESTION_LENGTH).max(MAX_QUESTION_LENGTH).optional(),
      expiresAt: z.coerce.date().optional(),
   })
   .refine(value => Object.keys(value).length > 0, { message: 'At least one property must be present in the object' })
// values are optional but in object cant be empty
export type UpdatePool = z.infer<typeof updatePoolSchema> & PoolId

export type PoolData = CreatePool & { id: number }
