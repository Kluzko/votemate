import { type Container } from 'inversify'

import { UserHttpController } from './api/userHttpController'

import { UserRepository } from './infrastructure/repositories'

import { UserMapper } from './infrastructure/mappers'

import { LoginUserCommandHandler } from './application/commands'

import { AuthUserQueryHandler, VerifyUserQueryHandler } from './application/queries'

import { symbols } from './symbols'

import { EmailService } from './application/services/EmailService'

export class UserModule {
   public static registerDependencies(container: Container) {
      container.bind(symbols.userHttpController).to(UserHttpController)

      container.bind(symbols.userRepository).to(UserRepository)

      container.bind(symbols.userMapper).to(UserMapper)

      container.bind(symbols.emailService).to(EmailService)

      container.bind(symbols.authUserQueryHandler).to(AuthUserQueryHandler)
      container.bind(symbols.verifyUserQueryHandler).to(VerifyUserQueryHandler)
      container.bind(symbols.loginUserCommandHandler).to(LoginUserCommandHandler)
   }
}
