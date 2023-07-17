import { type FastifyReply, type FastifyRequest } from 'fastify'
import { inject, injectable } from 'inversify'

import { type CastVoteCommandHandler } from '../application/commands'

import { symbols } from '../symbols'

import { CastVoteDataSchema } from './schemas'

@injectable()
export class VoteHttpController {
   public constructor(
      @inject(symbols.castVoteCommandHandler)
      private readonly castVoteCommandHandler: CastVoteCommandHandler
   ) {}

   public async vote(req: FastifyRequest, reply: FastifyReply) {
      const { answerId, poolId } = CastVoteDataSchema.parse(req.body)

      await this.castVoteCommandHandler.execute({
         answerId,
         poolId,
         voterId: req.voterId,
      })

      reply.send({ success: true })
   }
}
