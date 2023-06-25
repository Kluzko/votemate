import { type Container } from 'inversify'
import { PoolHttpController } from './api/poolHttpController'
import { CreatePoolCommandHandler } from './application/commands/createPoolCommandHandler'
import { PoolRepository } from './infrastructure/repositories/poolRepository'
import { symbols } from './symbols'
import { PoolMapper } from './infrastructure/mappers/poolMapper'
import { GetPoolQueryHandler } from './application/queries/getPoolQueryHandler'

export class PoolModule {
   public static registerDependencies(container: Container) {
      container.bind(symbols.poolHttpController).to(PoolHttpController)

      container.bind(symbols.poolRepository).to(PoolRepository)

      container.bind(symbols.poolMapper).to(PoolMapper)

      container.bind(symbols.createPoolCommandHandler).to(CreatePoolCommandHandler)
      container.bind(symbols.getPoolQueryHandler).to(GetPoolQueryHandler)
   }
}
