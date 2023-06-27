import { ContainerSingleton } from 'container'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { NotFoundError } from 'common/errors'

import { type CreatePool } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { Pool } from 'modules/pool/domain/entities'

import { symbols } from 'modules/pool/symbols'

import { type GetPoolQueryHandler } from './getPoolQueryHandler'

describe('GetPoolQueryHandler', () => {
   let getPoolQueryHandler: GetPoolQueryHandler
   let poolRepository: PoolRepository

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()
      getPoolQueryHandler = container.get(symbols.getPoolQueryHandler)
      poolRepository = container.get(symbols.poolRepository)
   })

   describe('.execute', () => {
      let result: { pool: Pool }
      let payload: CreatePool

      beforeAll(async () => {
         payload = {
            question: 'Test question',
            expiresAt: new Date(),
         }

         result = await poolRepository.createPool(payload)
      })

      afterAll(async () => {
         await poolRepository.deletePool({ id: result.pool.getId() })
      })

      it('should return the pool', async () => {
         const { pool } = await getPoolQueryHandler.execute({ id: result.pool.getId() })

         expect(pool).toBeInstanceOf(Pool)
         expect(pool.getId()).toBe(result.pool.getId())
         expect(pool.getQuestion()).toBe(result.pool.getQuestion())
         expect(pool.getExpiresAt()).toStrictEqual(result.pool.getExpiresAt()) // different objects in memory needs to be toStrictEqual TODO:check if it should be like this
      })

      it('should throw NotFoundError for non-existing Pool', async () => {
         try {
            await getPoolQueryHandler.execute({ id: -1 })
         } catch (error) {
            return expect(error).toBeInstanceOf(NotFoundError)
         }
         expect.fail()
      })
   })
})
