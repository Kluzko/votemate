import { z } from 'zod'

export type VoteData = {
   id: string
   answerId: string
   voterId: string
}

export type CastVoteData = {
   answerId: string
   voterId: string
   poolId: string
}

export const CastVoteDataSchema = z.object({
   answerId: z.string(),
   poolId: z.string(),
})

export type CheckVoteData = {
   answerId: string
   voterId: string
}

export type CheckAnswerData = z.infer<typeof CastVoteDataSchema>

export type VoteInPoolData = {
   voterId: string
   poolId: string
}

export type CreateVoteData = CheckVoteData

export type UpdateVoteData = {
   answerId: string
   voteId: string
}
