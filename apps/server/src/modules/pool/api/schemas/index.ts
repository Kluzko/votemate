import { z } from 'zod'

export const createPoolSchema = z
   .object({
      question: z.string().min(4).max(40),
      expiresAt: z.coerce.date(),
   })
   .strict()

export type CreatePool = z.infer<typeof createPoolSchema>

export const poolIdSchema = z.object({ id: z.string().transform(id => Number(id)) })

export type PoolId = z.infer<typeof poolIdSchema>

export const updatePoolSchema = z
   .object({
      question: z.string().min(4).max(40).optional(),
      expiresAt: z.coerce.date().optional(),
   })
   .refine(value => Object.keys(value).length > 0, { message: 'At least one property must be present in the object' })
// values are optional but in object cant be empty
export type UpdatePool = z.infer<typeof updatePoolSchema> & PoolId

export type PoolData = CreatePool & { id: number }
