import 'reflect-metadata'

import fastify from 'fastify'

import 'dotenv/config'

import './setup'

import { ContainerSingleton } from './container'

import { InvalidInputError, NotFoundError } from 'common/errors'

import { type PoolHttpController } from './modules/pool/api/poolHttpController'

import { symbols } from './modules/pool/symbols'

import { logger } from 'utils'

const container = ContainerSingleton.getInstance()

const app = fastify()

const port = parseInt(process.env.PORT)

const poolHttpController = container.get<PoolHttpController>(symbols.poolHttpController)

app.setErrorHandler(function (error, _request, reply) {
   if (error instanceof NotFoundError) {
      reply.status(400).send(error.message)
   }

   if (error instanceof InvalidInputError) {
      reply.status(422).send(error.issues)
   }

   reply.status(500).send('Internal server error')
})

app.post('/pool', poolHttpController.createPool.bind(poolHttpController))

app.get('/pool/:id', poolHttpController.getPool.bind(poolHttpController))

app.delete('/pool/:id', poolHttpController.deletePool.bind(poolHttpController))

app.listen({ port }, (error, address) => {
   if (error) logger.error(error)

   logger.info(`Server listening on on ${address}`)
})
