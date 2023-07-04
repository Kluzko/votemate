import { type FastifyReply, type FastifyRequest } from 'fastify'
import { inject, injectable } from 'inversify'

import {
   type CreatePoolCommandHandler,
   type DeletePoolCommandHandler,
   type UpdatePoolCommandHandler,
} from 'modules/pool/application/commands'

import {
   type GetPoolQueryHandler,
   type GetPublicPoolsQueryHandler,
   type GetUserPoolsQueryHandler,
} from 'modules/pool/application/queries'

import { symbols } from 'modules/pool/symbols'

import { createPoolSchema, poolIdSchema, updatePoolSchema } from './schemas'

@injectable()
export class PoolHttpController {
   public constructor(
      @inject(symbols.createPoolCommandHandler)
      private readonly createPoolCommandHandler: CreatePoolCommandHandler,

      @inject(symbols.getPoolQueryHandler)
      private readonly getPoolQueryHandler: GetPoolQueryHandler,

      @inject(symbols.getUserPoolsQueryHandler)
      private readonly getUserPoolsQueryHandler: GetUserPoolsQueryHandler,

      @inject(symbols.getPublicPoolsQueryHandler)
      private readonly getPublicPoolsQueryHandler: GetPublicPoolsQueryHandler,

      @inject(symbols.deletePoolCommandHandler)
      private readonly deletePoolCommandHandler: DeletePoolCommandHandler,

      @inject(symbols.updatePoolCommandHandler)
      private readonly updatePoolQueryHandler: UpdatePoolCommandHandler
   ) {}

   public async createPool(req: FastifyRequest, reply: FastifyReply) {
      const { expiresAt, question, answers, isPublic, password } = createPoolSchema.parse(req.body)
      const { pool } = await this.createPoolCommandHandler.execute({
         userId: req.user.id,
         expiresAt,
         question,
         answers,
         isPublic,
         password,
      })

      reply.send({ pool })
   }

   public async getPool(req: FastifyRequest, reply: FastifyReply) {
      const { id } = poolIdSchema.parse(req.params)
      const { pool } = await this.getPoolQueryHandler.execute({
         id,
         userId: req.user.id,
      })

      reply.send({ pool })
   }

   public async getUserPools(req: FastifyRequest, reply: FastifyReply) {
      const { pools } = await this.getUserPoolsQueryHandler.execute({ userId: req.user.id })

      reply.send({ pools })
   }

   public async getPublicPools(_req: FastifyRequest, reply: FastifyReply) {
      const { pools } = await this.getPublicPoolsQueryHandler.execute()

      reply.send({ pools })
   }

   public async deletePool(req: FastifyRequest, reply: FastifyReply) {
      const { id } = poolIdSchema.parse(req.params)

      const { pool } = await this.deletePoolCommandHandler.execute({
         id,
         userId: req.user.id,
      })

      reply.send({ pool })
   }

   public async updatePool(req: FastifyRequest, reply: FastifyReply) {
      const { id } = poolIdSchema.parse(req.params)
      const { expiresAt, question, answers, isPublic, password } = updatePoolSchema.parse(req.body)

      const { pool } = await this.updatePoolQueryHandler.execute({
         id,
         userId: req.user.id,
         expiresAt,
         question,
         answers,
         isPublic,
         password,
      })

      reply.send({ pool })
   }
}
