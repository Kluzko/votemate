import { injectable } from 'inversify'

import { type PrismaPoolWithAnswers } from 'modules/pool/api/schemas'

import { Pool } from 'modules/pool/domain/entities'

@injectable()
export class PoolMapper {
   public map({ id, question, expiresAt, answers, isPublic, password }: PrismaPoolWithAnswers) {
      return new Pool({
         id,
         question,
         expiresAt,
         answers: answers.map(({ id, value }) => ({
            id,
            value,
         })),
         isPublic,
         password: password ?? undefined,
      })
   }
}
