import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { app } from 'server'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { type PoolRepository } from '../infrastructure/repositories'

import { symbols } from '../symbols'

import { type CreatePool } from './schemas'

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
         payload = {
            question: faker.lorem.sentence(),
            expiresAt: faker.date.future(),
         }

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
            id: expect.any(Number),
            question: payload.question,
            expiresAt: payload.expiresAt.toISOString(),
         })
      })

      // describe('invalid data', () => {
      //    it('should throw InvalidInputError for empty object', async () => {
      //       const payload = {}
      //       const response = await supertest(app.server).post('/pool').send(payload)

      //       await supertest(app.server)
      //          .post('/pool')
      //          .send(payload)
      //          .end(error => {
      //             console.log(error)
      //          })

      //       it('should return 422', () => {
      //          expect(response.status).toBe(422)
      //       })
      //       expect.fail()
      //    })
      // })
   })
})
