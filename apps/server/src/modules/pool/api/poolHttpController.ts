import { type FastifyReply, type FastifyRequest } from 'fastify'
import { inject, injectable } from 'inversify'

import { type CreatePoolCommandHandler, type DeletePoolCommandHandler } from '../application/commands'

import { type GetPoolQueryHandler } from '../application/queries'

import { symbols } from '../symbols'

import { InvalidInputError } from '../../../common/errors'
import { createPoolSchema, poolIdSchema } from './schemas'

@injectable()
export class PoolHttpController {
   public constructor(
      @inject(symbols.createPoolCommandHandler)
      private readonly createPoolCommandHandler: CreatePoolCommandHandler,
      @inject(symbols.getPoolQueryHandler)
      private readonly getPoolQueryHandler: GetPoolQueryHandler,
      @inject(symbols.deletePoolCommandHandler)
      private readonly deletePoolCommandHandler: DeletePoolCommandHandler
   ) {}

   public async createPool(req: FastifyRequest, reply: FastifyReply) {
      const createPoolValidation = createPoolSchema.safeParse(req.body)

      if (!createPoolValidation.success) {
         return new InvalidInputError(createPoolValidation.error.issues)
      }

      const { pool } = await this.createPoolCommandHandler.execute(createPoolValidation.data)

      reply.send({ pool })
   }

   public async getPool(req: FastifyRequest, reply: FastifyReply) {
      const getPoolValidation = poolIdSchema.safeParse(req.params)

      if (!getPoolValidation.success) {
         return reply.code(422).send('Invalid input values')
      }

      const { pool } = await this.getPoolQueryHandler.execute(getPoolValidation.data)

      reply.send({ pool })
   }

   public async deletePool(req: FastifyRequest, reply: FastifyReply) {
      const deletePoolValidation = poolIdSchema.safeParse(req.params)

      if (!deletePoolValidation.success) {
         return reply.code(422).send('Invalid input values')
      }

      const { pool } = await this.deletePoolCommandHandler.execute(deletePoolValidation.data)

      reply.send({ pool })
   }
}
