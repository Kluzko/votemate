import 'dotenv/config'
import 'reflect-metadata'
import fastify from 'fastify'

import './setup'

import { logger } from 'utils'

import { ContainerSingleton } from './container'

import { type PoolHttpController } from './modules/pool/api/poolHttpController'
import { symbols } from './modules/pool/symbols'

const container = ContainerSingleton.getInstance()

const app = fastify()

const port = parseInt(process.env.PORT)

const poolHttpController = container.get<PoolHttpController>(symbols.poolHttpController)

// app.setErrorHandler(function (error, request, reply) {
//    if(error == instanceof())
//    reply.status(409).send({ ok: false })
// })

app.post('/pool', poolHttpController.createPool.bind(poolHttpController))
app.get('/pool/:id', poolHttpController.getPool.bind(poolHttpController))

app.listen({ port }, (error, address) => {
   if (error) logger.error(error)

   logger.info(`Server listening on on ${address}`)
})
