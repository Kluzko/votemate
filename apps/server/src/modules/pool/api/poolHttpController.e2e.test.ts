import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { app } from 'server'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { NotFoundError } from 'common/errors'

import { type PoolRepository } from '../infrastructure/repositories'

import { type Pool } from '../domain/entities'

import { symbols } from '../symbols'

import { type CreatePool } from './schemas'

const createPayload = (): CreatePool => ({
   question: faker.lorem.sentence(),
   expiresAt: faker.date.soon(3),
   answers: [...Array(5)].map(() => faker.lorem.sentence()),
   isPublic: true,
})

describe('PoolHttpController', () => {
   let poolRepository: PoolRepository

   beforeAll(async () => {
      const container = ContainerSingleton.getInstance()

      poolRepository = container.get(symbols.poolRepository)
   })

   describe('createPool', () => {
      let response: supertest.Response

      let payload: CreatePool

      beforeAll(async () => {
         payload = createPayload()

         response = await supertest(app.server).post('/pool').send(payload)
      })

      afterAll(async () => {
         await poolRepository.deletePool({ id: response.body.pool.id })
      })

      it('should return 200', () => {
         expect(response.status).toBe(200)
      })

      it('should have a valid Pool in body', () => {
         expect(response.body.pool).toEqual({
            id: expect.any(String),
            question: payload.question,
            expiresAt: payload.expiresAt.toISOString(),
            answers: expect.arrayContaining(payload.answers),
            isPublic: payload.isPublic,
         })
      })

      describe('invalid data', () => {
         it('should return 422 for empty object', async () => {
            const payload = {}
            const response = await supertest(app.server).post('/pool').send(payload)

            expect(response.status).toBe(422)
         })
         it('should return 422 for missing required fields', async () => {
            const payload = { question: 'Sample Question' }
            const response = await supertest(app.server).post('/pool').send(payload)

            expect(response.status).toBe(422)
         })
      })
   })

   describe('getPool', () => {
      let response: supertest.Response
      let result: { pool: Pool }
      let payload: CreatePool

      beforeAll(async () => {
         payload = createPayload()

         result = await poolRepository.createPool(payload)

         response = await supertest(app.server).get(`/pool/${result.pool.getId()}`)
      })

      afterAll(async () => {
         await poolRepository.deletePool({ id: result.pool.getId() })
      })

      it('should return 200', () => {
         expect(response.status).toBe(200)
      })

      it('should have a valid Pool in body', () => {
         expect(response.body.pool).toEqual({
            id: result.pool.getId(),
            question: result.pool.getQuestion(),
            expiresAt: result.pool.getExpiresAt().toISOString(),
            answers: expect.arrayContaining(result.pool.getAnswers()),
            isPublic: result.pool.getIsPublic(),
         })
      })
   })

   describe('deletePool', () => {
      let response: supertest.Response
      let result: { pool: Pool }
      let payload: CreatePool

      beforeAll(async () => {
         payload = createPayload()

         result = await poolRepository.createPool(payload)

         response = await supertest(app.server).delete(`/pool/${result.pool.getId()}`)
      })

      it('should return 200', () => {
         expect(response.status).toBe(200)
      })

      it('should return a valid Pool object in the response', () => {
         expect(response.body.pool).toEqual({
            id: result.pool.getId(),
            question: result.pool.getQuestion(),
            expiresAt: result.pool.getExpiresAt().toISOString(),
            answers: expect.arrayContaining(result.pool.getAnswers()),
            isPublic: result.pool.getIsPublic(),
         })
      })

      it('Pool should be deleted', async () => {
         try {
            await poolRepository.getPool({ id: result.pool.getId() })
         } catch (error) {
            return expect(error).toBeInstanceOf(NotFoundError)
         }

         expect.fail()
      })
   })

   describe.skip('updatePool', () => {
      let response: supertest.Response
      let result: { pool: Pool }
      let payload: CreatePool
      let updatePayload: CreatePool

      beforeAll(async () => {
         payload = createPayload()

         result = await poolRepository.createPool(payload)

         updatePayload = createPayload()

         response = await supertest(app.server).put(`/pool/${result.pool.getId()}`).send(updatePayload)
      })

      afterAll(async () => {
         await poolRepository.deletePool({ id: result.pool.getId() })
      })

      it('should return 200', () => {
         expect(response.status).toBe(200)
      })

      it('should return a valid Pool object in the response', () => {
         expect(response.body.pool).toEqual({
            id: result.pool.getId(),
            question: updatePayload.question,
            expiresAt: updatePayload.expiresAt.toISOString(),
         })
      })

      it('should update the pool with the new data', async () => {
         const { pool } = await poolRepository.getPool({ id: result.pool.getId() })

         expect(pool).toBeDefined()
         expect(pool.getQuestion()).toBe(updatePayload.question)
         expect(pool.getExpiresAt().toISOString()).toBe(updatePayload.expiresAt.toISOString())
      })
   })
})
