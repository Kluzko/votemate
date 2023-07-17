import { inject, injectable } from 'inversify'

import { type UserId } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { symbols } from 'modules/pool/symbols'

@injectable()
export class GetUserPoolsQueryHandler {
   public constructor(
      @inject(symbols.poolRepository)
      private readonly poolRepository: PoolRepository
   ) {}

   public async execute(payload: UserId) {
      const { pools } = await this.poolRepository.getUserPools(payload)

      return { pools }
   }
}
