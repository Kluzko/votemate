import { type User } from '@prisma/client'
import { ContainerSingleton } from 'container'
import jwt from 'jsonwebtoken'
import { app } from 'server'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { prisma } from 'prisma'

import { NotFoundError } from 'common/errors'

import { type PoolRepository } from '../infrastructure/repositories'

import { type Pool } from '../domain/entities'

import { symbols } from '../symbols'

import { mockPoolData } from '../infrastructure/test-utils'
import { type CreatePool } from './schemas'

describe('PoolHttpController', () => {
   let poolRepository: PoolRepository
   let authToken: string
   let user: User

   beforeAll(async () => {
      const container = ContainerSingleton.getInstance()

      poolRepository = container.get(symbols.poolRepository)

      user = await prisma.user.create({ data: { email: 'testerx@example.com' } })

      authToken = jwt.sign({ email: 'testerx@example.com' }, process.env.JWT_SECRET)
   })

   afterAll(async () => {
      await prisma.user.delete({ where: { id: user.id } })
      app.server.close()
   })

   describe('createPool', () => {
      let response: supertest.Response
      let payload: CreatePool

      beforeAll(async () => {
         payload = {
            ...mockPoolData.createBasePoolNoUserId(),
            userId: user.id,
         }
         response = await supertest(app.server).post('/api/pool').set('Cookie', `authToken=${authToken}`).send(payload)
      })

      afterAll(async () => {
         await poolRepository.deletePool({
            id: response.body.pool.id,
            userId: user.id,
         })
      })

      it('should return 200', () => {
         expect(response.status).toBe(200)
      })

      it('should have a valid Pool in body', () => {
         expect(response.body.pool).toEqual({
            id: expect.any(String),
            question: payload.question,
            expiresAt: payload.expiresAt.toISOString(),
            answers: expect.arrayContaining(
               payload.answers.map(value => ({
                  id: expect.any(String),
                  value,
               }))
            ),
            isPublic: payload.isPublic,
            password: payload.password,
         })
      })

      describe('Error scenarios', () => {
         it('should return 422 for empty object', async () => {
            const payload = {}
            const failResponse = await supertest(app.server)
               .post('/api/pool')
               .set('Cookie', `authToken=${authToken}`)
               .send(payload)

            expect(failResponse.status).toBe(422)
         })

         it('should return 422 for missing required fields', async () => {
            const payload = { question: 'Sample Question' }
            const failResponse = await supertest(app.server)
               .post('/api/pool')
               .set('Cookie', `authToken=${authToken}`)
               .send(payload)

            expect(failResponse.status).toBe(422)
         })

         it('should return 422 for missing required fields', async () => {
            const payload = { question: 'Sample Question' }
            const failResponse = await supertest(app.server)
               .post('/api/pool')
               .set('Cookie', `authToken=${authToken}`)
               .send(payload)

            expect(failResponse.status).toBe(422)
         })

         it('should return 404 for NotFound auth token', async () => {
            const payload = {
               ...mockPoolData.createBasePoolNoUserId(),
               userId: user.id,
            }

            const failResponse = await supertest(app.server).post('/api/pool').send(payload)
            expect(failResponse.status).toBe(404)
         })
      })
   })

   describe('getPool', () => {
      let response: supertest.Response
      let result: { pool: Pool }
      let payload: CreatePool

      beforeAll(async () => {
         payload = {
            ...mockPoolData.createBasePoolNoUserId(),
            userId: user.id,
         }

         result = await poolRepository.createPool(payload)

         response = await supertest(app.server).get(`/api/pool/${result.pool.getId()}`)
      })

      afterAll(async () => {
         await poolRepository.deletePool({
            id: result.pool.getId(),
            userId: user.id,
         })
      })

      it('should return 200', () => {
         expect(response.status).toBe(200)
      })

      it('should have a valid Pool in body', () => {
         expect(response.body.pool).toEqual({
            id: expect.any(String),
            question: payload.question,
            expiresAt: payload.expiresAt.toISOString(),
            answers: expect.arrayContaining(
               payload.answers.map(value => ({
                  id: expect.any(String),
                  value,
               }))
            ),
            isPublic: payload.isPublic,
            password: payload.password,
            voteCounts: expect.objectContaining(Object.fromEntries(payload.answers.map(value => [value, 0]))),
            votedAnswerId: null,
         })
      })

      describe('Error Scenarios', () => {
         it('should return 404 for a nonexistent Pool', async () => {
            const nonexistentId = 'nonexistent-id'
            const failResponse = await supertest(app.server).get(`/api/pool/${nonexistentId}`)

            expect(failResponse.status).toBe(404)
         })
      })
   })

   describe('deletePool', () => {
      let response: supertest.Response
      let result: { pool: Pool }
      let payload: CreatePool

      beforeAll(async () => {
         payload = {
            ...mockPoolData.createBasePoolNoUserId(),
            userId: user.id,
         }

         result = await poolRepository.createPool(payload)

         response = await supertest(app.server)
            .delete(`/api/pool/${result.pool.getId()}`)
            .set('Cookie', `authToken=${authToken}`)
      })

      it('should return 200', () => {
         expect(response.status).toBe(200)
      })

      it('should return a valid Pool object in the response', () => {
         expect(response.body.pool).toEqual({
            id: expect.any(String),
            question: payload.question,
            expiresAt: payload.expiresAt.toISOString(),
            answers: expect.arrayContaining(
               payload.answers.map(value => ({
                  id: expect.any(String),
                  value,
               }))
            ),
            isPublic: payload.isPublic,
            password: payload.password,
         })
      })

      it('Pool should be deleted', async () => {
         try {
            await poolRepository.getPool({
               id: result.pool.getId(),
               voterId: 'someVoterId',
            })
         } catch (error) {
            return expect(error).toBeInstanceOf(NotFoundError)
         }

         expect.fail()
      })

      describe('Error Scenarios', () => {
         it('should return 404 for a nonexistent Pool', async () => {
            const nonexistentId = 'nonexistent-id'
            const failResponse = await supertest(app.server)
               .delete(`/api/pool/${nonexistentId}`)
               .set('Cookie', `authToken=${authToken}`)

            expect(failResponse.status).toBe(404)
         })

         it('should return 404 for no authToken provided', async () => {
            const failResponse = await supertest(app.server).delete(`/api/pool/${result.pool.getId()}`)

            expect(failResponse.status).toBe(404)
         })
      })
   })

   describe('updatePool', () => {
      let response: supertest.Response
      let result: { pool: Pool }
      let payload: CreatePool
      let updatePayload: CreatePool

      beforeAll(async () => {
         payload = {
            ...mockPoolData.createBasePoolNoUserId(),
            userId: user.id,
         }

         result = await poolRepository.createPool(payload)

         updatePayload = {
            ...mockPoolData.createBasePoolNoUserId(),
            userId: user.id,
         }

         response = await supertest(app.server)
            .put(`/api/pool/${result.pool.getId()}`)
            .set('Cookie', `authToken=${authToken}`)
            .send(payload)
            .send(updatePayload)
      })

      afterAll(async () => {
         await poolRepository.deletePool({
            id: result.pool.getId(),
            userId: user.id,
         })
      })

      it('should return 200', () => {
         expect(response.status).toBe(200)
      })

      it('should return a valid updated Pool object in the response', () => {
         expect(response.body.pool).toEqual({
            id: result.pool.getId(),
            question: updatePayload.question,
            expiresAt: updatePayload.expiresAt.toISOString(),
            answers: expect.arrayContaining(
               updatePayload.answers.map(value => ({
                  id: expect.any(String),
                  value,
               }))
            ),
            isPublic: updatePayload.isPublic,
            password: updatePayload.password,
         })
      })

      describe('Error Scenarios', () => {
         it('should return 404 for a nonexistent Pool', async () => {
            const nonexistentId = 'nonexistent-id'

            const failResponse = await supertest(app.server)
               .put(`/api/pool/${nonexistentId}`)
               .set('Cookie', `authToken=${authToken}`)
               .send(updatePayload)

            expect(failResponse.status).toBe(404)
         })

         it('should return 404 for no authToken provided', async () => {
            const failResponse = await supertest(app.server).put(`/api/pool/${result.pool.getId()}`).send(updatePayload)

            expect(failResponse.status).toBe(404)
         })
      })
   })
})
