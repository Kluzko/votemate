import { type FastifyReply, type FastifyRequest } from 'fastify'
import { inject, injectable } from 'inversify'

import { InvalidInputError } from 'common/errors'

import {
   type CreatePoolCommandHandler,
   type DeletePoolCommandHandler,
   type UpdatePoolCommandHandler,
} from 'modules/pool/application/commands'

import { type GetPoolQueryHandler } from 'modules/pool/application/queries'

import { symbols } from 'modules/pool/symbols'

import { createPoolSchema, poolIdSchema, updatePoolSchema } from './schemas'

@injectable()
export class PoolHttpController {
   public constructor(
      @inject(symbols.createPoolCommandHandler)
      private readonly createPoolCommandHandler: CreatePoolCommandHandler,
      @inject(symbols.getPoolQueryHandler)
      private readonly getPoolQueryHandler: GetPoolQueryHandler,
      @inject(symbols.deletePoolCommandHandler)
      private readonly deletePoolCommandHandler: DeletePoolCommandHandler,
      @inject(symbols.updatePoolCommandHandler)
      private readonly updatePoolQueryHandler: UpdatePoolCommandHandler
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

   public async updatePool(req: FastifyRequest, reply: FastifyReply) {
      const poolIdValidation = poolIdSchema.safeParse(req.params)

      if (!poolIdValidation.success) {
         return reply.code(422).send('Invalid input values')
      }
      const updatePoolValidation = updatePoolSchema.safeParse(req.body)

      if (!updatePoolValidation.success) {
         return new InvalidInputError(updatePoolValidation.error.issues)
      }
      const payload = {
         id: poolIdValidation.data.id,
         ...updatePoolValidation.data,
      }
      const { pool } = await this.updatePoolQueryHandler.execute(payload)

      reply.send({ pool })
   }
}
