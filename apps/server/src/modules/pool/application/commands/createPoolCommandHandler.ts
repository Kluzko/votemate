import { inject, injectable } from 'inversify'

import { type CreatePool } from '../../api/schemas'

import { type PoolRepository } from '../../infrastructure/repositories'

import { symbols } from '../../symbols'

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
