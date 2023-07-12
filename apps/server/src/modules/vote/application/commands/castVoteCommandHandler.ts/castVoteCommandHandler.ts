import { inject, injectable } from 'inversify'

import { VoteProcessingError } from 'common/errors'

import { SocketIOService } from 'services'

import { type CastVoteData } from 'modules/vote/api/schemas'

import { type VoteRepository } from 'modules/vote/infrastructure/repositories'

import { symbols } from 'modules/vote/symbols'

@injectable()
export class CastVoteCommandHandler {
   public constructor(
      @inject(symbols.voteRepository)
      private readonly voteRepository: VoteRepository
   ) {}

   public async execute(payload: CastVoteData) {
      if (await this.voteRepository.hasVotedTwiceOnAnswer(payload)) {
         throw new VoteProcessingError('You can only vote once on the same answer.')
      }

      if (!(await this.voteRepository.checkIfAnswerBelongsToPool(payload))) {
         throw new VoteProcessingError('Answer does not exist in the current pool.')
      }

      const existingVote = await this.voteRepository.findVoteInPoolByVoter(payload)
      if (existingVote) {
         const { vote } = existingVote
         await this.voteRepository.updateVote({
            voteId: vote.getId(),
            answerId: payload.answerId,
         })
      } else {
         await this.voteRepository.createVote(payload)
      }

      SocketIOService.emitVote(payload.poolId)
   }
}
