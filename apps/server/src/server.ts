import 'dotenv/config'
import 'reflect-metadata'
import fastify from 'fastify'

import './setup'

import { logger } from 'utils'

import { ContainerSingleton } from './container'

import { type PoolHttpController } from 'modules/pool/api/poolHttpController'
import { symbols } from 'modules/pool/symbols'

const container = ContainerSingleton.getInstance()

const app = fastify()

const port = parseInt(process.env.PORT)

const poolHttpController = container.get<PoolHttpController>(symbols.poolHttpController)

app.post('/pool', (res, reply) => poolHttpController.createPool(res, reply))

app.listen({ port }, (error, address) => {
   if (error) logger.error(error)

   logger.info(`Server listening on on ${address}`)
})
