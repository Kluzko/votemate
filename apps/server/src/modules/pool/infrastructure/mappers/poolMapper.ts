import { type Pool as PrismaPool } from '@prisma/client'
import { injectable } from 'inversify'

import { Pool } from 'modules/pool/domain/entities'

@injectable()
export class PoolMapper {
   public map({ id, question, expiresAt }: PrismaPool) {
      return new Pool({
         id,
         question,
         expiresAt,
      })
   }
}
