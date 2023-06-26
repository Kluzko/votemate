import { inject, injectable } from 'inversify'

import { prisma } from 'prisma'

import { type CreatePool, type PoolId, type UpdatePool } from '../../api/schemas'

import { symbols } from '../../symbols'

import { NotFoundError } from '../../../../common/errors'
import { type PoolMapper } from '../mappers/poolMapper'

@injectable()
export class PoolRepository {
   public constructor(
      @inject(symbols.poolMapper)
      private readonly poolMapper: PoolMapper
   ) {}

   public async createPool({ question, expiresAt }: CreatePool) {
      const pool = await prisma.pool.create({
         data: {
            question,
            expiresAt,
         },
      })

      return { pool: this.poolMapper.map(pool) }
   }

   public async getPool({ id }: PoolId) {
      const pool = await prisma.pool.findFirst({ where: { id } })

      if (!pool) {
         throw new NotFoundError('Pool')
      }

      return { pool: this.poolMapper.map(pool) }
   }

   public async deletePool({ id }: PoolId) {
      const pool = await prisma.pool.findFirst({ where: { id } })

      if (!pool) {
         throw new NotFoundError('Pool')
      }

      await prisma.pool.delete({ where: { id } })

      return { pool: this.poolMapper.map(pool) }
   }

   public async updatePool({ id, question, expiresAt }: UpdatePool) {
      const pool = await prisma.pool.findFirst({ where: { id } })

      if (!pool) {
         throw new NotFoundError('Pool')
      }

      const updatedPool = await prisma.pool.update({
         where: { id },
         data: {
            question,
            expiresAt,
         },
      })

      return { pool: this.poolMapper.map(updatedPool) }
   }
}
