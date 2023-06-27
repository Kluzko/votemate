import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { Pool } from 'modules/pool/domain/entities'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { type CreatePool } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { symbols } from '../../symbols'

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
      let payload: CreatePool

      beforeAll(() => {
         const pool = new Pool({
            id: faker.datatype.number(),
            question: faker.lorem.sentence(),
            expiresAt: faker.date.soon(3),
         })

         payload = {
            question: pool.getQuestion(),
            expiresAt: pool.getExpiresAt(),
         }
      })

      describe('.execute', () => {
         let result: { pool: Pool }

         beforeAll(async () => {
            result = await createPoolCommandHandler.execute(payload)
         })

         it('should return a pool object', () => {
            expect(result.pool).instanceOf(Pool)
         })
         // clean up
         afterAll(async () => {
            const id = result.pool.getId()
            await poolRepository.deletePool({ id })
         })
      })
   })
})
