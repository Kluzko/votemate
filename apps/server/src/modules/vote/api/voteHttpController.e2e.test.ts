import { faker } from '@faker-js/faker'
import { type Answer, type Pool } from '@prisma/client'
import { app } from 'server'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { prisma } from 'prisma'

describe('voteHttpController', () => {
   let response: supertest.Response
   let prismaPool: Pool & { answers: Answer[] }

   beforeAll(async () => {
      prismaPool = await prisma.pool.create({
         data: {
            question: 'Test',
            isPublic: true,
            expiresAt: new Date(),
            userId: faker.datatype.uuid(),
            answers: { create: [{ value: 'Test Answer 1' }] },
         },
         include: { answers: true },
      })
   })

   afterAll(async () => {
      await prisma.pool.delete({ where: { id: prismaPool.id } })
      app.server.close()
   })

   it('should return 200', async () => {
      const votePayload = {
         poolId: prismaPool.id,
         answerId: prismaPool.answers[0].id,
      }

      response = await supertest(app.server).post('/api/vote').send(votePayload)
      expect(response.status).toBe(200)
   })

   describe('Error scenarios', () => {
      it('should return 422 for empty object', async () => {
         const votePayload = {}
         const failResponse = await supertest(app.server).post('/api/vote').send(votePayload)

         expect(failResponse.status).toBe(422)
      })

      it('should return 400 for bad poolId', async () => {
         const votePayload = {
            poolId: 'nonexistent-id',
            answerId: prismaPool.answers[0].id,
         }
         const failResponse = await supertest(app.server).post('/api/vote').send(votePayload)

         expect(failResponse.status).toBe(400)
      })

      it('should return 400 for bad answerId', async () => {
         const votePayload = {
            poolId: prismaPool.id,
            answerId: 'nonexistent-id',
         }
         const failResponse = await supertest(app.server).post('/api/vote').send(votePayload)

         expect(failResponse.status).toBe(400)
      })
   })
})
