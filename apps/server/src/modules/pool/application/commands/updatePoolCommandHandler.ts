import { inject, injectable } from 'inversify'

import { type UpdatePool } from '../../api/schemas'

import { type PoolRepository } from '../../infrastructure/repositories'

import { symbols } from '../../symbols'

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
