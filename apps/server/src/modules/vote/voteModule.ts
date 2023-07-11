import { type Container } from 'inversify'

import { VoteHttpController } from './api/voteHttpController'

import { VoteRepository } from './infrastructure/repositories'

import { VoteMapper } from './infrastructure/mappers'

import { CastVoteCommandHandler } from './application/commands'

import { symbols } from './symbols'

export class VoteModule {
   public static registerDependencies(container: Container) {
      container.bind(symbols.voteHttpController).to(VoteHttpController)

      container.bind(symbols.voteRepository).to(VoteRepository)

      container.bind(symbols.voteMapper).to(VoteMapper)

      container.bind(symbols.castVoteCommandHandler).to(CastVoteCommandHandler)
   }
}
