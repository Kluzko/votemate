import { ContainerSingleton } from 'container'
import { mockPoolData } from 'modules/pool/infrastructure/test-utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { type CreatePool, type PoolData } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { symbols } from 'modules/pool/symbols'

import { type GetUserPoolsQueryHandler } from './getUserPoolsQueryHandler'

describe('GetUserPoolsQueryHandler', () => {
   let getUserPoolsQueryHandler: GetUserPoolsQueryHandler
   let poolRepository: PoolRepository
   let userPool: CreatePool
   let createdPoolId: string

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()
      getUserPoolsQueryHandler = container.get(symbols.getUserPoolsQueryHandler)
      poolRepository = container.get(symbols.poolRepository)
   })

   describe('.execute', () => {
      let result: { pools: (PoolData & { totalVotes: number })[] }

      beforeAll(async () => {
         userPool = mockPoolData.createBasePoolData()

         const { pool } = await poolRepository.createPool(userPool)
         createdPoolId = pool.getId()

         result = await getUserPoolsQueryHandler.execute({ userId: userPool.userId })
      })

      afterAll(async () => {
         await poolRepository.deletePool({
            id: createdPoolId,
            userId: userPool.userId,
         })
      })

      it('should return user pools', () => {
         // TODO: make omit method for mock data
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const { userId, ...payloadNoUserId } = userPool

         expect(result.pools).toEqual(
            expect.arrayContaining([
               {
                  ...payloadNoUserId,
                  id: expect.any(String),
                  answers: expect.arrayContaining(
                     payloadNoUserId.answers.map(value => ({
                        id: expect.any(String),
                        value,
                     }))
                  ),
                  totalVotes: 0,
               },
            ])
         )
      })
   })
})
