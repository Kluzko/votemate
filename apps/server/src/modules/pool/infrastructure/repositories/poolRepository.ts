import { inject, injectable } from 'inversify'

import { prisma } from 'prisma'

import { NotFoundError } from 'common/errors'

import { type CreatePool, type PoolQuery, type UpdatePool, type UserId } from 'modules/pool/api/schemas'

import { type PoolMapper } from '../mappers'

import { symbols } from '../../symbols'

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

   public async getPool({ id, userId }: PoolQuery) {
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

      return { pool: this.poolMapper.map(pool) }
   }

   public async getUserPools({ userId }: UserId) {
      const pools = await prisma.pool.findMany({
         where: { userId },
         include: { answers: true },
         orderBy: { createdAt: 'desc' },
      })

      if (!pools) {
         throw new NotFoundError('Pool')
      }

      return { pools: pools.map(pool => this.poolMapper.map(pool)) }
   }

   public async getPublicPools() {
      const pools = await prisma.pool.findMany({
         where: { isPublic: true },
         include: { answers: true },
         orderBy: { createdAt: 'desc' },
      })

      if (!pools) {
         throw new NotFoundError('Pool')
      }

      return { pools: pools.map(pool => this.poolMapper.map(pool)) }
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
