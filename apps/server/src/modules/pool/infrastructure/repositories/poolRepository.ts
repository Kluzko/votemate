import { inject, injectable } from 'inversify'

import { prisma } from 'prisma'

import { type CreatePool, type PoolId } from '../../api/schemas'

import { symbols } from '../../symbols'

import { NotFoundError } from '../../../../common/errors'
import { type PoolMapper } from '../mappers/poolMapper'

@injectable()
export class PoolRepository {
   public constructor(
      @inject(symbols.poolMapper)
      private readonly poolMapper: PoolMapper
   ) {}

   public async createPool({ question, expiresAt, answers }: CreatePool) {
      const pool = await prisma.pool.create({
         data: {
            question,
            expiresAt,
            answers: { createMany: { data: answers.map(answer => ({ value: answer })) } },
         },
         include: { answers: true },
      })

      return { pool: this.poolMapper.map(pool) }
   }

   public async getPool({ id }: PoolId) {
      const pool = await prisma.pool.findFirst({
         where: { id },
         include: { answers: true },
      })

      if (!pool) {
         throw new NotFoundError('Pool')
      }

      return { pool: this.poolMapper.map(pool) }
   }
}
