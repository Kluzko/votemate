import { inject, injectable } from 'inversify'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { symbols } from 'modules/pool/symbols'

@injectable()
export class GetPublicPoolsQueryHandler {
   public constructor(
      @inject(symbols.poolRepository)
      private readonly poolRepository: PoolRepository
   ) {}

   public async execute() {
      const { pools } = await this.poolRepository.getPublicPools()

      return { pools }
   }
}
