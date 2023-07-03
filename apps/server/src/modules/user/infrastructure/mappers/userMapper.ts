import { type User as PrismaUser } from '@prisma/client'
import { injectable } from 'inversify'

import { User } from 'modules/user/domain/entities'

@injectable()
export class UserMapper {
   public map({ id, email }: PrismaUser) {
      return new User({
         id,
         email,
      })
   }
}
