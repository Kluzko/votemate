import { type Answer as AnswerPool, type Pool as PrismaPool } from '@prisma/client'
import { injectable } from 'inversify'

import { Pool } from 'modules/pool/domain/entities'

type PoolMapperInput = PrismaPool & { answers: AnswerPool[] }

@injectable()
export class PoolMapper {
   public map({ id, question, expiresAt, answers, isPublic, password }: PoolMapperInput) {
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
