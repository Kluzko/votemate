import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { prisma } from 'prisma'

import { type CreatePool } from 'modules/pool/api/schemas'

import { type Pool } from 'modules/pool/domain/entities'

import { symbols } from 'modules/pool/symbols'

import { type PoolRepository } from './poolRepository'

const createPayload = () => ({
   question: faker.lorem.sentence(),
   expiresAt: faker.date.future(),
})

describe('PoolRepository', () => {
   let payload: CreatePool
   let poolRepository: PoolRepository
   let result: { pool: Pool }

   beforeAll(async () => {
      const container = ContainerSingleton.getInstance()
      poolRepository = container.get(symbols.poolRepository)
   })

   describe('createPool', () => {
      beforeAll(async () => {
         payload = createPayload()
         result = await poolRepository.createPool(payload)
      })
      afterAll(async () => {
         await prisma.pool.delete({ where: { id: result.pool.getId() } })
      })

      it('Should return vaild object', () =>
         expect(result.pool).toEqual({
            id: expect.any(Number),
            question: payload.question,
            expiresAt: payload.expiresAt,
         }))
   })
})
