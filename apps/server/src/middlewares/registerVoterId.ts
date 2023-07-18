import { type FastifyReply, type FastifyRequest } from 'fastify'
import { sign, verify } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { voterIdSchema } from 'modules/user/api/schemas'

export const registerVoterId = async (req: FastifyRequest, reply: FastifyReply) => {
   let { voterId } = req.cookies

   if (!voterId) {
      const newVoterId = uuidv4()
      voterId = sign({ voterId: newVoterId }, process.env.JWT_SECRET, { expiresIn: '1y' })

      reply.setCookie('voterId', voterId, {
         path: '/',
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: true,
      })
   }

   try {
      const { voterId: verifiedVoterId } = voterIdSchema.parse(verify(voterId, process.env.JWT_SECRET))
      req.voterId = verifiedVoterId
   } catch (err) {
      console.log('JWT verification failed: ', err)
      throw err
   }
}
