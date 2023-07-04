import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { type CreatePool } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { Pool } from 'modules/pool/domain/entities'

import { symbols } from 'modules/pool/symbols'

import { type CreatePoolCommandHandler } from './createPoolCommandHandler'

describe('CreatePoolCommandHandler', () => {
   let createPoolCommandHandler: CreatePoolCommandHandler
   let poolRepository: PoolRepository

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()

      createPoolCommandHandler = container.get(symbols.createPoolCommandHandler)
      poolRepository = container.get(symbols.poolRepository)
   })

   describe('Given valid Pool', () => {
      let publicPoolPayload: CreatePool

      beforeAll(() => {
         const publicPool = new Pool({
            id: faker.datatype.uuid(),
            question: faker.lorem.sentence(),
            expiresAt: faker.date.soon(3),
            answers: [...Array(5)].map(() => faker.lorem.sentence()),
            isPublic: true,
         })

         publicPoolPayload = {
            question: publicPool.getQuestion(),
            expiresAt: publicPool.getExpiresAt(),
            answers: publicPool.getAnswers(),
            isPublic: publicPool.getIsPublic(),
         }
      })

      describe('.execute', () => {
         let result: { pool: Pool }

         beforeAll(async () => {
            result = await createPoolCommandHandler.execute(publicPoolPayload)
         })

         afterAll(async () => {
            await poolRepository.deletePool({ id: result.pool.getId() })
         })

         it('should return a valid Public Pool', () => {
            expect(result.pool).toBeInstanceOf(Pool)
         })
      })
   })
})
