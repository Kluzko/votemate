import { inject, injectable } from 'inversify'

import { prisma } from 'prisma'

import {
   type CheckAnswerData,
   type CheckVoteData,
   type CreateVoteData,
   type UpdateVoteData,
   type VoteInPoolData,
} from 'modules/vote/api/schemas'

import { type VoteMapper } from '../mappers'

import { symbols } from 'modules/vote/symbols'

@injectable()
export class VoteRepository {
   public constructor(
      @inject(symbols.voteMapper)
      private readonly voteMapper: VoteMapper
   ) {}

   async hasVotedTwiceOnAnswer({ answerId, voterId }: CheckVoteData) {
      const result = await prisma.vote.findUnique({
         where: {
            answerId_voterId: {
               answerId,
               voterId,
            },
         },
      })
      return !!result
   }

   async checkIfAnswerBelongsToPool({ answerId, poolId }: CheckAnswerData) {
      const answer = await prisma.answer.findUnique({
         where: { id: answerId },
         include: { Pool: true },
      })

      return answer && answer.Pool.id === poolId
   }

   async findVoteInPoolByVoter({ voterId, poolId }: VoteInPoolData) {
      const existingVote = await prisma.vote.findFirst({
         where: {
            voterId,
            Answer: { poolId },
         },
         include: { Answer: true },
      })

      return existingVote ? { vote: this.voteMapper.map(existingVote) } : null
   }

   async createVote({ answerId, voterId }: CreateVoteData) {
      const vote = await prisma.vote.create({
         data: {
            answerId,
            voterId,
         },
      })

      return { vote: this.voteMapper.map(vote) }
   }

   async updateVote({ answerId, voteId }: UpdateVoteData) {
      const vote = await prisma.vote.update({
         where: { id: voteId },
         data: { answerId },
      })

      return { vote: this.voteMapper.map(vote) }
   }
}
