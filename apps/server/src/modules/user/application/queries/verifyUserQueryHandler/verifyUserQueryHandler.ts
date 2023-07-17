import { inject, injectable } from 'inversify'
import { sign, verify } from 'jsonwebtoken'

import { type VerifyData, tokenSchema } from 'modules/user/api/schemas'

import { type UserRepository } from 'modules/user/infrastructure/repositories'

import { symbols } from 'modules/user/symbols'

@injectable()
export class VerifyUserQueryHandler {
   public constructor(
      @inject(symbols.userRepository)
      private readonly userRepository: UserRepository
   ) {}
   public async execute({ emailToken }: VerifyData) {
      const { email } = tokenSchema.parse(verify(emailToken, process.env.JWT_SECRET))

      await this.userRepository.upsertUser({ email })

      const authToken = sign({ email }, process.env.JWT_SECRET, { expiresIn: '30d' })

      return { authToken }
   }
}
