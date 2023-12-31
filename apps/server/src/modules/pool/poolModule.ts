import { type Container } from 'inversify'

import { PoolHttpController } from './api/poolHttpController'

import { PoolRepository } from './infrastructure/repositories'

import { PoolMapper } from './infrastructure/mappers'

import { CreatePoolCommandHandler, DeletePoolCommandHandler, UpdatePoolCommandHandler } from './application/commands'

import { GetPoolQueryHandler, GetPublicPoolsQueryHandler, GetUserPoolsQueryHandler } from './application/queries'

import { symbols } from './symbols'

export class PoolModule {
   public static registerDependencies(container: Container) {
      container.bind(symbols.poolHttpController).to(PoolHttpController)

      container.bind(symbols.poolRepository).to(PoolRepository)

      container.bind(symbols.poolMapper).to(PoolMapper)

      container.bind(symbols.createPoolCommandHandler).to(CreatePoolCommandHandler)
      container.bind(symbols.getPoolQueryHandler).to(GetPoolQueryHandler)
      container.bind(symbols.getUserPoolsQueryHandler).to(GetUserPoolsQueryHandler)
      container.bind(symbols.getPublicPoolsQueryHandler).to(GetPublicPoolsQueryHandler)
      container.bind(symbols.deletePoolCommandHandler).to(DeletePoolCommandHandler)
      container.bind(symbols.updatePoolCommandHandler).to(UpdatePoolCommandHandler)
   }
}
