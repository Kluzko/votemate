import { ContainerSingleton } from 'container'
import { Pool } from 'modules/pool/domain/entities'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { NotFoundError } from 'common/errors'

import { type CreatePool, type PoolId } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { symbols } from '../../symbols'

import { type GetPoolQueryHandler } from './getPoolQueryHandler'

describe('GetPoolQueryHandler', () => {
   let getPoolQueryHandler: GetPoolQueryHandler
   let poolRepository: PoolRepository
   let createdPool: Pool
   let payload: CreatePool

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()
      getPoolQueryHandler = container.get(symbols.getPoolQueryHandler)
      poolRepository = container.get(symbols.poolRepository)
   })

   describe('.execute', () => {
      beforeAll(async () => {
         payload = {
            question: 'Test question',
            expiresAt: new Date(),
         }

         const result = await poolRepository.createPool(payload)
         createdPool = result.pool
      })
      it('should return the pool', async () => {
         const query: PoolId = { id: createdPool.getId() }

         const result = await getPoolQueryHandler.execute(query)

         expect(result.pool).toBeInstanceOf(Pool)
         expect(result.pool.getId()).toBe(createdPool.getId())
         expect(result.pool.getQuestion()).toBe(createdPool.getQuestion())
         expect(result.pool.getExpiresAt()).toStrictEqual(createdPool.getExpiresAt()) // different objects in memory needs to be toStrictEqual TODO:check if it should be like this
      })

      it('should throw NotFoundError for non-existing pool', async () => {
         const nonExistingPoolId = -1
         try {
            await getPoolQueryHandler.execute({ id: nonExistingPoolId })
         } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
         }
      })

      // clean up
      afterAll(async () => {
         await poolRepository.deletePool({ id: createdPool.getId() })
      })
   })
})
