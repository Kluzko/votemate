import { ContainerSingleton } from 'container'
import { mockPoolData } from 'modules/pool/infrastructure/test-utils'
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
         payload = mockPoolData.createBasePoolData()

         result = await poolRepository.createPool(payload)

         updatePayload = {
            ...mockPoolData.createBasePoolData(),
            userId: payload.userId,
            id: result.pool.getId(),
         }

         await updatePoolCommandHandler.execute(updatePayload)
      })

      afterAll(async () => {
         await poolRepository.deletePool({
            id: result.pool.getId(),
            userId: updatePayload.userId,
         })
      })

      it('should update the Pool', async () => {
         const updatedPool = await poolRepository.getPool({
            id: result.pool.getId(),
            voterId: 'some-fake-voter',
         })

         // TODO: make omit method for mock data
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const { userId, ...payloadNoUserId } = updatePayload

         expect(updatedPool.pool).toEqual({
            ...payloadNoUserId,
            answers: expect.arrayContaining(
               payloadNoUserId.answers.map(value => ({
                  id: expect.any(String),
                  value,
               }))
            ),
            voteCounts: expect.objectContaining(Object.fromEntries(payloadNoUserId.answers.map(value => [value, 0]))),
            votedAnswerId: null,
            id: result.pool.getId(),
         })
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
