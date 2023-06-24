import { inject, injectable } from 'inversify'
import { type PoolRepository } from '../../infrastructure/repositories/poolRepository'
import { symbols } from '../../symbols'
import { type CreatePool } from 'modules/pool/api/schemas'

@injectable()
export class CreatePoolCommandHandler {
   public constructor(
      @inject(symbols.poolRepository)
      private readonly poolRepository: PoolRepository
   ) {}

   public async execute(payload: CreatePool) {
      const { pool } = await this.poolRepository.createPool(payload)

      return { pool }
   }
}
