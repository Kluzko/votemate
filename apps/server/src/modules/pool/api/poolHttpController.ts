import { type FastifyReply, type FastifyRequest } from 'fastify'
import { inject, injectable } from 'inversify'

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
      const { expiresAt, question } = createPoolSchema.parse(req.body)

      const { pool } = await this.createPoolCommandHandler.execute({
         expiresAt,
         question,
      })

      reply.send({ pool })
   }

   public async getPool(req: FastifyRequest, reply: FastifyReply) {
      const { id } = poolIdSchema.parse(req.params)

      const { pool } = await this.getPoolQueryHandler.execute({ id })

      reply.send({ pool })
   }

   public async deletePool(req: FastifyRequest, reply: FastifyReply) {
      const { id } = poolIdSchema.parse(req.params)

      const { pool } = await this.deletePoolCommandHandler.execute({ id })

      reply.send({ pool })
   }

   public async updatePool(req: FastifyRequest, reply: FastifyReply) {
      const { id } = poolIdSchema.parse(req.params)

      const { expiresAt, question } = updatePoolSchema.parse(req.body)

      const { pool } = await this.updatePoolQueryHandler.execute({
         id,
         expiresAt,
         question,
      })

      reply.send({ pool })
   }
}
