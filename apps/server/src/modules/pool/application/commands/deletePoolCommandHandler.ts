import { inject, injectable } from 'inversify'

import { type PoolId } from '../../api/schemas'

import { type PoolRepository } from '../../infrastructure/repositories'

import { symbols } from '../../symbols'

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
