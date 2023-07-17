import { type FastifyReply, type FastifyRequest } from 'fastify'
import { inject, injectable } from 'inversify'

import { type LoginUserCommandHandler } from '../application/commands'

import { type AuthUserQueryHandler, type VerifyUserQueryHandler } from '../application/queries'

import { symbols } from 'modules/user/symbols'

import { AuthSchema, VerifySchema, loginUserSchema } from './schemas'

@injectable()
export class UserHttpController {
   public constructor(
      @inject(symbols.verifyUserQueryHandler)
      private readonly verifyUserQueryHandler: VerifyUserQueryHandler,
      @inject(symbols.authUserQueryHandler)
      private readonly authUserQueryHandler: AuthUserQueryHandler,
      @inject(symbols.loginUserCommandHandler)
      private readonly loginUserCommandHandler: LoginUserCommandHandler
   ) {}

   public async loginUser(req: FastifyRequest, reply: FastifyReply) {
      const { email } = loginUserSchema.parse(req.body)

      await this.loginUserCommandHandler.execute({ email })

      reply.send({
         success: true,
         email,
      })
   }

   public async verifyUser(req: FastifyRequest, reply: FastifyReply) {
      const { emailToken } = VerifySchema.parse(req.query)

      const { authToken } = await this.verifyUserQueryHandler.execute({ emailToken })

      reply
         .setCookie('authToken', authToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
         })
         .send({ success: true })
   }

   public async authUser(req: FastifyRequest, reply: FastifyReply) {
      const { authToken } = AuthSchema.parse(req.cookies)

      await this.authUserQueryHandler.execute({ authToken })

      reply.send({ isAuthenticated: true })
   }

   public async logoutUser(_req: FastifyRequest, reply: FastifyReply) {
      reply.clearCookie('authToken', { path: '/' }).send({ success: true })
   }
}
