import { type Container } from 'inversify'
import { PoolHttpController } from './api/poolHttpController'
import { CreatePoolCommandHandler } from './application/commands/createPoolCommandHandler'
import { PoolRepository } from './infrastructure/repositories/poolRepository'
import { symbols } from './symbols'
import { PoolMapper } from './infrastructure/mappers/poolMapper'

export class PoolModule {
   public static bind(container: Container) {
      container.bind(symbols.poolHttpController).to(PoolHttpController)
      container.bind(symbols.poolRepository).toConstructor(PoolRepository)
      container.bind(symbols.poolMapper).toConstructor(PoolMapper)
      container.bind(symbols.createPoolCommandHandler).toConstructor(CreatePoolCommandHandler)
   }
}
