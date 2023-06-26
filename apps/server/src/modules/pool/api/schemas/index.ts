import { z } from 'zod'

export const createPoolSchema = z.object({
   question: z.string().min(4).max(40),
   expiresAt: z.coerce.date(),
   answers: z.string().array(),
})

export type CreatePool = z.infer<typeof createPoolSchema>

export const poolIdSchema = z.object({ id: z.string().transform(id => Number(id)) })

export type PoolId = z.infer<typeof poolIdSchema>
