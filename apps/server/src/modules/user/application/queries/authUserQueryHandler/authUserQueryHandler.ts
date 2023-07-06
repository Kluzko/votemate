import { inject, injectable } from 'inversify'
import { verify } from 'jsonwebtoken'

import { NotFoundError } from 'common/errors'

import { type AuthData, tokenSchema } from 'modules/user/api/schemas'

import { type UserRepository } from 'modules/user/infrastructure/repositories'

import { symbols } from 'modules/user/symbols'

@injectable()
export class AuthUserQueryHandler {
   public constructor(
      @inject(symbols.userRepository)
      private readonly userRepository: UserRepository
   ) {}

   public async execute({ authToken }: AuthData) {
      if (!authToken) {
         throw new NotFoundError('Token')
      }

      const { email } = tokenSchema.parse(verify(authToken, process.env.JWT_SECRET))

      const user = await this.userRepository.findUser({ email })

      if (!user) {
         throw new NotFoundError('User')
      }
   }
}
