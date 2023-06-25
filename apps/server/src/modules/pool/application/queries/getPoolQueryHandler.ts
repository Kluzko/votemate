import { inject, injectable } from 'inversify'
import { type PoolRepository } from '../../infrastructure/repositories/poolRepository'
import { symbols } from '../../symbols'
import { type GetPool } from 'modules/pool/api/schemas'

@injectable()
export class GetPoolQueryHandler {
   public constructor(
      @inject(symbols.poolRepository)
      private readonly poolRepository: PoolRepository
   ) {}

   public async execute(payload: GetPool) {
      const { pool } = await this.poolRepository.getPool(payload)

      return { pool }
   }
}
