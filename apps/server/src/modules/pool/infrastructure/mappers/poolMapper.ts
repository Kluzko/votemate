import { Pool as PrismaPool } from '@prisma/client'
import { injectable } from 'inversify'
import { Pool } from 'modules/pool/domain/entities/pool'

@injectable()
export class PoolMapper {
   public map({ question, answers, expiresAt }: PrismaPool) {
      return new Pool({
         question,
         answers,
         expiresAt,
      })
   }
}
