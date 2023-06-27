import { inject, injectable } from 'inversify'

import { type PoolId } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { symbols } from 'modules/pool/symbols'

@injectable()
export class GetPoolQueryHandler {
   public constructor(
      @inject(symbols.poolRepository)
      private readonly poolRepository: PoolRepository
   ) {}

   public async execute(payload: PoolId) {
      const { pool } = await this.poolRepository.getPool(payload)

      return { pool }
   }
}
