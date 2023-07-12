import { type Vote as PrismaVote } from '@prisma/client'
import { injectable } from 'inversify'

import { Vote } from 'modules/vote/domain/entities'

@injectable()
export class VoteMapper {
   public map({ id, answerId, voterId }: PrismaVote) {
      return new Vote({
         id,
         answerId,
         voterId,
      })
   }
}
