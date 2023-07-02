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

         afterAll(async () => {
            await poolRepository.deletePool({ id: result.pool.getId() })
         })

         it('should return a valid Pool', () => {
            expect(result.pool).toBeInstanceOf(Pool)
         })
      })
   })
})
