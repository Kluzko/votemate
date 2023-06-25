import { z } from 'zod'

export const createPoolSchema = z.object({
   question: z.string().min(4).max(40),
   expiresAt: z.coerce.date(),
   answers: z.string().array(),
})
export const getPoolSchema = z.object({ id: z.string().transform(id => Number(id)) })

export type CreatePool = z.infer<typeof createPoolSchema>
export type GetPool = z.infer<typeof getPoolSchema>
