import { inject, injectable } from 'inversify'

import { type UpdatePool } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { symbols } from 'modules/pool/symbols'

@injectable()
export class UpdatePoolCommandHandler {
   public constructor(
      @inject(symbols.poolRepository)
      private readonly poolRepository: PoolRepository
   ) {}

   public async execute(payload: UpdatePool) {
      const { pool } = await this.poolRepository.updatePool(payload)

      return { pool }
   }
}
