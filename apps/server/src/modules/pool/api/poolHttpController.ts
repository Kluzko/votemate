import { type FastifyReply, type FastifyRequest } from 'fastify'
import { inject, injectable } from 'inversify'
import { type CreatePoolCommandHandler } from '../application/commands/createPoolCommandHandler'
import { symbols } from '../symbols'
import { createPoolSchema, getPoolSchema } from './schemas'
import { type GetPoolQueryHandler } from '../application/queries/getPoolQueryHandler'

@injectable()
export class PoolHttpController {
   public constructor(
      @inject(symbols.createPoolCommandHandler)
      private readonly createPoolCommandHandler: CreatePoolCommandHandler,
      @inject(symbols.getPoolQueryHandler)
      private readonly getPoolQueryHandler: GetPoolQueryHandler
   ) {}

   public async createPool(req: FastifyRequest, reply: FastifyReply) {
      const createPoolValidation = createPoolSchema.safeParse(req.body)

      if (!createPoolValidation.success) {
         return reply.code(400).send('Invalid input values')
      }

      const { pool } = await this.createPoolCommandHandler.execute(createPoolValidation.data)

      reply.send({ pool })
   }

   public async getPool(req: FastifyRequest, reply: FastifyReply) {
      const getPoolValidation = getPoolSchema.safeParse(req.params)

      if (!getPoolValidation.success) {
         return reply.code(400).send('Invalid input values')
      }

      const { pool } = await this.getPoolQueryHandler.execute(getPoolValidation.data)

      reply.send({ pool })
   }
}
