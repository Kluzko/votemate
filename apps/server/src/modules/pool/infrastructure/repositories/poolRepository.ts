import { inject, injectable } from 'inversify'

import { prisma } from 'prisma'

import { NotFoundError } from 'common/errors'

import {
   type CreatePool,
   type PoolQuery,
   type UpdatePool,
   type UserId,
   type VoteCounts,
} from 'modules/pool/api/schemas'

import { type PoolMapper } from '../mappers'

import { symbols } from 'modules/pool/symbols'

@injectable()
export class PoolRepository {
   public constructor(
      @inject(symbols.poolMapper)
      private readonly poolMapper: PoolMapper
   ) {}

   public async createPool({ userId, question, expiresAt, answers, isPublic, password }: CreatePool) {
      const pool = await prisma.pool.create({
         data: {
            question,
            expiresAt,
            answers: { createMany: { data: answers.map(answer => ({ value: answer })) } },
            isPublic,
            password,
            userId,
         },
         include: { answers: true },
      })

      return { pool: this.poolMapper.map(pool) }
   }

   public async getPool({ id, voterId }: { id: string; voterId: string }) {
      const pool = await prisma.pool.findFirst({
         where: { id },
         include: { answers: { include: { votes: true } } },
      })

      if (!pool) {
         throw new NotFoundError('Pool')
      }

      const voteCounts: VoteCounts = {}
      let votedAnswerId: string | null = null

      pool.answers.forEach(answer => {
         voteCounts[answer.value] = answer.votes.length
         const vote = answer.votes.find(vote => vote.voterId === voterId)
         if (vote) {
            votedAnswerId = vote.answerId
         }
      })

      return {
         pool: {
            ...this.poolMapper.map(pool).toPlainObject(),
            voteCounts,
            votedAnswerId: votedAnswerId as string | null,
         },
      }
   }

   public async getUserPools({ userId }: UserId) {
      const pools = await prisma.pool.findMany({
         where: { userId },
         include: { answers: { include: { votes: true } } },
         orderBy: { expiresAt: 'asc' },
      })

      const mappedPools = pools.map(pool => {
         let totalVotes = 0
         pool.answers.forEach(answer => {
            totalVotes += answer.votes.length
         })

         return {
            ...this.poolMapper.map(pool).toPlainObject(),
            totalVotes,
         }
      })

      return { pools: mappedPools }
   }

   public async getPublicPools() {
      const pools = await prisma.pool.findMany({
         where: { isPublic: true },
         include: { answers: { include: { votes: true } } },
         orderBy: { expiresAt: 'asc' },
      })

      const mappedPools = pools.map(pool => {
         let totalVotes = 0
         pool.answers.forEach(answer => {
            totalVotes += answer.votes.length
         })

         return {
            ...this.poolMapper.map(pool).toPlainObject(),
            totalVotes,
         }
      })

      return { pools: mappedPools }
   }

   public async deletePool({ id, userId }: PoolQuery) {
      const pool = await prisma.pool.findFirst({
         where: {
            id,
            userId,
         },
      })

      if (!pool) {
         throw new NotFoundError('Pool')
      }

      const deletedPool = await prisma.pool.delete({
         where: { id },
         include: { answers: true },
      })

      return { pool: this.poolMapper.map(deletedPool) }
   }

   // TODO: Optimize and test edge cases where missing values from previous answers should be deleted in the payload.
   public async updatePool({ id, userId, question, expiresAt, answers, isPublic, password }: UpdatePool) {
      const pool = await prisma.pool.findFirst({
         where: {
            id,
            userId,
         },
         include: { answers: true },
      })

      if (!pool) {
         throw new NotFoundError('Pool')
      }

      const operations = []

      // Find changed answers and create/update/delete them accordingly
      for (let i = 0; i < Math.max(answers.length, pool.answers.length); i++) {
         const existingAnswer = pool.answers[i]
         const newAnswer = answers[i]

         if (existingAnswer && newAnswer && newAnswer !== existingAnswer.value) {
            // Update existing answer
            operations.push(
               prisma.answer.update({
                  where: { id: existingAnswer.id },
                  data: { value: newAnswer },
               })
            )
         } else if (existingAnswer && !newAnswer) {
            // Delete existing answer if corresponding new answer is not provided
            operations.push(prisma.answer.delete({ where: { id: existingAnswer.id } }))
         } else if (!existingAnswer && newAnswer) {
            // Create new answer if corresponding existing answer is not found
            operations.push(
               prisma.answer.create({
                  data: {
                     value: newAnswer,
                     Pool: { connect: { id: pool.id } },
                  },
               })
            )
         }
      }

      await prisma.$transaction(operations)

      const updatedPool = await prisma.pool.update({
         where: { id },
         data: {
            question,
            expiresAt,
            isPublic,
            password,
         },
         include: { answers: true },
      })

      return { pool: this.poolMapper.map(updatedPool) }
   }
}
