import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { NotFoundError } from 'common/errors'

import { type CreatePool, type UpdatePool } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { type Pool } from 'modules/pool/domain/entities'

import { symbols } from 'modules/pool/symbols'

import { type UpdatePoolCommandHandler } from './updatePoolCommandHandler'

describe('UpdatePoolCommandHandler', () => {
   let updatePoolCommandHandler: UpdatePoolCommandHandler
   let poolRepository: PoolRepository

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()
      updatePoolCommandHandler = container.get(symbols.updatePoolCommandHandler)
      poolRepository = container.get(symbols.poolRepository)
   })

   describe('.execute', () => {
      let payload: CreatePool
      let updatePayload: UpdatePool
      let result: { pool: Pool }

      beforeAll(async () => {
         payload = {
            question: faker.lorem.sentence(),
            expiresAt: faker.date.soon(3),
            answers: [...Array(5)].map(() => faker.lorem.sentence()),
            isPublic: true,
         }

         result = await poolRepository.createPool(payload)

         updatePayload = {
            id: result.pool.getId(),
            question: 'Updated question',
            expiresAt: result.pool.getExpiresAt(),
            answers: [...Array(3)].map(() => faker.lorem.sentence()),
            isPublic: true,
         }

         await updatePoolCommandHandler.execute(updatePayload)
      })

      afterAll(async () => {
         await poolRepository.deletePool({ id: result.pool.getId() })
      })

      it('should update the Pool', async () => {
         const updatedPool = await poolRepository.getPool({ id: result.pool.getId() })
         expect(updatedPool.pool.getQuestion()).toBe(updatePayload.question)
         expect(updatedPool.pool.getAnswers()).toEqual(updatePayload.answers)
         expect(updatedPool.pool.getIsPublic()).toEqual(updatePayload.isPublic)
      })

      it('should throw NotFoundError for non-existing Pool', async () => {
         try {
            await updatePoolCommandHandler.execute({
               id: 'xd',
               ...payload,
            })
         } catch (error) {
            return expect(error).toBeInstanceOf(NotFoundError)
         }
         expect.fail()
      })
   })
})
