import { inject, injectable } from 'inversify'
import { type CreatePool } from 'modules/pool/api/schemas'
import { symbols } from 'modules/pool/symbols'
import { prisma } from 'prisma'
import { type PoolMapper } from '../mappers/poolMapper'

@injectable()
export class PoolRepository {
   public constructor(
      @inject(symbols.poolMapper)
      private readonly poolMapper: PoolMapper
   ) {}

   public async createPool({ question, expiresAt, answers }: CreatePool) {
      const prismaPool = await prisma.pool.create({
         data: {
            question,
            expiresAt,
            answers: { createMany: { data: answers.map(answer => ({ value: answer })) } },
         },
      })

      return { pool: this.poolMapper.map(prismaPool) }
   }
}
