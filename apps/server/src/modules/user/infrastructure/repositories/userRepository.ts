import { inject, injectable } from 'inversify'

import { prisma } from 'prisma'

import { type UserEmail } from 'modules/user/api/schemas'

import { symbols } from 'modules/user/symbols'

import { type UserMapper } from '../mappers/userMapper'

@injectable()
export class UserRepository {
   public constructor(
      @inject(symbols.userMapper)
      private readonly userMapper: UserMapper
   ) {}

   public async upsertUser({ email }: UserEmail) {
      const user = await prisma.user.upsert({
         where: { email },
         update: {},
         create: { email },
      })

      return { user: this.userMapper.map(user) }
   }

   public async findUser({ email }: UserEmail) {
      const user = await prisma.user.findFirst({ where: { email } })

      if (!user) {
         return null
      }

      return { user: this.userMapper.map(user) }
   }
}
