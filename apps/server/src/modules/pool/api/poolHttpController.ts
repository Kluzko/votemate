import { type FastifyReply, type FastifyRequest } from 'fastify'
import { inject, injectable } from 'inversify'
import { type CreatePoolCommandHandler } from '../application/commands/createPoolCommandHandler'
import { symbols } from '../symbols'
import { createPoolSchema } from './schemas'

@injectable()
export class PoolHttpController {
   public constructor(
      @inject(symbols.createPoolCommandHandler)
      private readonly createPoolCommandHandler: CreatePoolCommandHandler
   ) {}

   public async createPool(req: FastifyRequest, reply: FastifyReply) {
      const createPoolValidation = createPoolSchema.safeParse(req.body)

      if (!createPoolValidation.success) {
         console.log(createPoolValidation.error)
         return reply.code(400).send('Invalid input values')
      }

      const { pool } = await this.createPoolCommandHandler.execute(createPoolValidation.data)

      reply.send({ pool })
   }
}
