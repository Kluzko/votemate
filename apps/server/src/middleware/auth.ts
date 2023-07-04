import { type FastifyReply, type FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'

import { prisma } from 'prisma'

import { NotFoundError } from 'common/errors'

import { tokenSchema } from 'modules/user/api/schemas'

export const auth = async (req: FastifyRequest, _reply: FastifyReply) => {
   const { authToken } = req.cookies

   if (!authToken) {
      throw new NotFoundError('Token')
   }

   const { email } = tokenSchema.parse(verify(authToken, process.env.JWT_SECRET))

   const user = await prisma.user.findFirst({ where: { email } })

   if (!user) {
      throw new NotFoundError('User')
   }

   req.user = user
}
