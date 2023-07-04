import 'reflect-metadata'

import fastifyCookie from '@fastify/cookie'
import { type User } from '@prisma/client'
import fastify from 'fastify'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { ZodError } from 'zod'

import 'dotenv/config'

import './setup'

import { ContainerSingleton } from './container'

import { NotFoundError, SmtpError } from 'common/errors'

import { auth } from 'middlewares'

import { type PoolHttpController } from './modules/pool/api/poolHttpController'
import { type UserHttpController } from 'modules/user/api/userHttpController'

import { symbols as poolSymbols } from './modules/pool/symbols'
import { symbols as userSymbols } from './modules/user/symbols'

import { logger } from 'utils'

const container = ContainerSingleton.getInstance()

export const app = fastify()

declare module 'fastify' {
   interface FastifyRequest {
      user: User
   }
}

app.register(fastifyCookie, {
   secret: process.env.COOKIE_SECRET,
   hook: 'onRequest',
   parseOptions: {},
})

const poolHttpController = container.get<PoolHttpController>(poolSymbols.poolHttpController)

const userHttpController = container.get<UserHttpController>(userSymbols.userHttpController)

app.setErrorHandler(function (error, _request, reply) {
   if (error instanceof NotFoundError) {
      reply.status(404).send(error.message)
   }

   if (error instanceof ZodError) {
      const message = error.issues.map(({ path, message }) => `Invalid value '${path[0]}': ${message} `)
      reply.status(422).send(message)
   }

   if (error instanceof TokenExpiredError) {
      reply.status(403).send({ error: 'Token expired' })
   }

   if (error instanceof JsonWebTokenError) {
      reply.status(401).send({ error: 'Invalid token' })
   }

   if (error instanceof SmtpError) {
      reply.status(421).send(error.message)
   }

   if (process.env.NODE_ENV == 'development') {
      console.log(error.message)
   }

   reply.status(500).send('Internal server error')
})

// User
app.post('/api/login', userHttpController.loginUser.bind(userHttpController))

app.get('/api/verify', userHttpController.verifyUser.bind(userHttpController))

app.get('/api/auth', userHttpController.authUser.bind(userHttpController))

app.post('/api/logout', userHttpController.logoutUser.bind(userHttpController))

// Pools
app.post('/api/pool', { preHandler: [auth] }, poolHttpController.createPool.bind(poolHttpController))

app.get('/api/pool/:id', { preHandler: [auth] }, poolHttpController.getPool.bind(poolHttpController))

app.get('/api/user/pools', { preHandler: [auth] }, poolHttpController.getUserPools.bind(poolHttpController))

app.get('/api/pools', poolHttpController.getPublicPools.bind(poolHttpController))

app.delete('/api/pool/:id', { preHandler: [auth] }, poolHttpController.deletePool.bind(poolHttpController))

app.put('/api/pool/:id', { preHandler: [auth] }, poolHttpController.updatePool.bind(poolHttpController))

const port = parseInt(process.env.PORT)

app.listen({ port }, (error, address) => {
   if (error) logger.error(error)

   logger.info(`Server listening on on ${address}`)
})
