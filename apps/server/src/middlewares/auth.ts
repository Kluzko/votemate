import { type FastifyReply, type FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'

import { prisma } from 'prisma'

import { NotFoundError } from 'common/errors'

import { tokenSchema } from 'modules/user/api/schemas'

export const auth = async (request: FastifyRequest, _reply: FastifyReply) => {
   const { authToken } = request.cookies

   if (!authToken) {
      throw new NotFoundError('Token')
   }

   const { email } = tokenSchema.parse(verify(authToken, process.env.JWT_SECRET))

   const user = await prisma.user.findFirst({ where: { email } })

   if (!user) {
      throw new NotFoundError('User')
   }

   request.user = user
}
