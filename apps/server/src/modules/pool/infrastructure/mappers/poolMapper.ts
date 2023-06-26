import { type Pool as PrismaPool } from '@prisma/client'
import { injectable } from 'inversify'

import { Pool } from '../../domain/entities/'

@injectable()
export class PoolMapper {
   public map({ question, expiresAt }: PrismaPool) {
      return new Pool({
         question,
         expiresAt,
      })
   }
}
