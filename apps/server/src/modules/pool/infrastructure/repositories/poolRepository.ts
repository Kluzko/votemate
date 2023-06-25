import { inject, injectable } from 'inversify'
import { type GetPool, type CreatePool } from 'modules/pool/api/schemas'
import { symbols } from 'modules/pool/symbols'
import { prisma } from 'prisma'
import { type PoolMapper } from '../mappers/poolMapper'
import { NotFoundError } from 'common/errors/NotFoundError'

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
      })

      return { pool: this.poolMapper.map(pool) }
   }

   public async getPool({ id }: GetPool) {
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
