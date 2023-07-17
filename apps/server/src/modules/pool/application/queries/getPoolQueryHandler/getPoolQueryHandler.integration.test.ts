import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { mockPoolData } from 'modules/pool/infrastructure/test-utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { NotFoundError } from 'common/errors'

import { type CreatePool } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { type Pool } from 'modules/pool/domain/entities'

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
      let mockPool: CreatePool
      const voterId = faker.datatype.uuid()

      beforeAll(async () => {
         mockPool = mockPoolData.createBasePoolData()

         result = await poolRepository.createPool(mockPool)
      })

      afterAll(async () => {
         await poolRepository.deletePool({
            id: result.pool.getId(),
            userId: mockPool.userId,
         })
      })

      it('should return the pool for a given id and voterId', async () => {
         const payload = {
            id: result.pool.getId(),
            voterId,
         }
         const { pool } = await getPoolQueryHandler.execute(payload)

         // TODO: make omit method for mock data
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const { userId, ...mockWithOutUserId } = mockPool

         expect(pool).toEqual({
            ...mockWithOutUserId,
            answers: expect.arrayContaining(
               mockWithOutUserId.answers.map(value => ({
                  id: expect.any(String),
                  value,
               }))
            ),
            voteCounts: expect.objectContaining(Object.fromEntries(mockWithOutUserId.answers.map(value => [value, 0]))),
            votedAnswerId: null,
            id: result.pool.getId(),
         })
      })

      it('should throw NotFoundError for non-existing Pool', async () => {
         try {
            await getPoolQueryHandler.execute({
               id: 'non-existing-id',
               voterId,
            })
         } catch (error) {
            return expect(error).toBeInstanceOf(NotFoundError)
         }
         expect.fail()
      })
   })
})
