import { inject, injectable } from 'inversify'
import { sign } from 'jsonwebtoken'

import { type UserEmail } from 'modules/user/api/schemas'

import { symbols } from 'modules/user/symbols'

import { type EmailService } from '../../services/EmailService'

@injectable()
export class LoginUserCommandHandler {
   public constructor(
      @inject(symbols.emailService)
      private readonly emailService: EmailService
   ) {}
   public async execute({ email }: UserEmail) {
      const emailToken = sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' })

      await this.emailService.sendMagicLink(email, emailToken)
   }
}
