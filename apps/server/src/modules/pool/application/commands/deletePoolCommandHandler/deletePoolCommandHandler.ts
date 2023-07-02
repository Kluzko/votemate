import { inject, injectable } from 'inversify'

import { type PoolId } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { symbols } from 'modules/pool/symbols'

@injectable()
export class DeletePoolCommandHandler {
   public constructor(
      @inject(symbols.poolRepository)
      private readonly poolRepository: PoolRepository
   ) {}

   public async execute(payload: PoolId) {
      const { pool } = await this.poolRepository.deletePool(payload)

      return { pool }
   }
}
