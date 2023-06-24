import Fastify from 'fastify'

import 'dotenv/config'
import './setup'

import { logger } from 'utils'

const fastify = Fastify()

fastify.listen({ port: 3001 }, (error, address) => {
   if (error) logger.error(error)

   logger.info(`Server listening on on ${address}`)
})
