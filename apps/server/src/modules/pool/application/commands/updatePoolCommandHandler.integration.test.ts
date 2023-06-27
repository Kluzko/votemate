import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { type Pool } from 'modules/pool/domain/entities'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { NotFoundError } from 'common/errors'

import { type CreatePool, type UpdatePool } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { symbols } from '../../symbols'

import { type UpdatePoolCommandHandler } from './updatePoolCommandHandler'

describe('UpdatePoolCommandHandler', () => {
   let updatePoolCommandHandler: UpdatePoolCommandHandler
   let poolRepository: PoolRepository
   let createdPool: Pool
   let payload: CreatePool
   let updatePayload: UpdatePool

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()
      updatePoolCommandHandler = container.get(symbols.updatePoolCommandHandler)
      poolRepository = container.get(symbols.poolRepository)
   })

   describe('.execute', () => {
      beforeAll(async () => {
         payload = {
            question: faker.lorem.sentence(),
            expiresAt: faker.date.soon(3),
         }

         const result = await poolRepository.createPool(payload)
         createdPool = result.pool

         updatePayload = {
            id: createdPool.getId(),
            question: 'Updated question',
            expiresAt: createdPool.getExpiresAt(),
         }
      })

      it('should update the pool', async () => {
         await updatePoolCommandHandler.execute(updatePayload)

         const updatedPool = await poolRepository.getPool({ id: createdPool.getId() })
         expect(updatedPool.pool.getQuestion()).toBe(updatePayload.question)
      })

      it('should throw NotFoundError for non-existing pool', async () => {
         const nonExistingPoolId = -1
         const invalidUpdatePayload = {
            id: nonExistingPoolId,
            question: 'Some question',
            expiresAt: new Date(),
         }

         try {
            await updatePoolCommandHandler.execute(invalidUpdatePayload)
         } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
         }
      })
   })

   // clean up
   afterAll(async () => {
      await poolRepository.deletePool({ id: createdPool.getId() })
   })
})
