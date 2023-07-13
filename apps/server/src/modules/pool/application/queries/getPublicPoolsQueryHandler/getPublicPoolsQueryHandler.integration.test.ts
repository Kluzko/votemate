import { ContainerSingleton } from 'container'
import { mockPoolData } from 'modules/pool/infrastructure/test-utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { NotFoundError } from 'common/errors'

import { type CreatePool, type PoolData } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { symbols } from 'modules/pool/symbols'

import { type GetPublicPoolsQueryHandler } from './getPublicPoolsQueryHandler'

describe('GetPublicPoolsQueryHandler', () => {
   let getPublicPoolsQueryHandler: GetPublicPoolsQueryHandler
   let poolRepository: PoolRepository
   let publicPool: CreatePool

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()
      getPublicPoolsQueryHandler = container.get(symbols.getPublicPoolsQueryHandler)
      poolRepository = container.get(symbols.poolRepository)
   })

   describe('.execute', () => {
      let result: { pools: (PoolData & { totalVotes: number })[] }
      let createdPoolId: string
      beforeAll(async () => {
         // Assuming the createBasePoolData creates public pools
         publicPool = mockPoolData.createBasePoolData()
         const { pool } = await poolRepository.createPool(publicPool)
         createdPoolId = pool.getId()
         result = await getPublicPoolsQueryHandler.execute()
      })

      afterAll(async () => {
         await poolRepository.deletePool({
            id: createdPoolId,
            userId: publicPool.userId,
         })
      })

      it('should return public pools', () => {
         // TODO: make omit method for mock data
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const { userId, ...payloadNoUserId } = publicPool

         expect(result.pools).toEqual(
            expect.arrayContaining([
               {
                  ...payloadNoUserId,
                  answers: expect.arrayContaining(
                     payloadNoUserId.answers.map(value => ({
                        id: expect.any(String),
                        value,
                     }))
                  ),
                  id: createdPoolId,
                  isPublic: true,
                  totalVotes: 0,
               },
            ])
         )
      })

      it('should throw NotFoundError when there are no public pools', async () => {
         // Assuming you have a method for setting a pool as private
         await poolRepository.updatePool({
            ...publicPool,
            id: createdPoolId,
            isPublic: false,
         })

         try {
            await getPublicPoolsQueryHandler.execute()
         } catch (error) {
            return expect(error).toBeInstanceOf(NotFoundError)
         }

         expect.fail()
      })
   })
})
