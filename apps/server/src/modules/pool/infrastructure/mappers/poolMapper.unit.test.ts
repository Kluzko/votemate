import { faker } from '@faker-js/faker'
import { type Pool as PrismaPool } from '@prisma/client'
import { ContainerSingleton } from 'container'
import { beforeAll, describe, expect, it } from 'vitest'

import { Pool } from 'modules/pool/domain/entities'

import { symbols } from 'modules/pool/symbols'

import { type PoolMapper } from './poolMapper'

describe('PoolMapper', () => {
   let poolMapper: PoolMapper
   let pool: Pool
   let prismaPool: PrismaPool

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()

      poolMapper = container.get(symbols.poolMapper)

      prismaPool = {
         id: 1,
         createdAt: faker.date.recent(),
         updatedAt: faker.date.recent(),
         expiresAt: faker.date.future(),
         question: 'Test',
      }
      pool = poolMapper.map(prismaPool)
   })

   it('should map PrismaPool to Pool', () => {
      expect(pool).toBeInstanceOf(Pool)
   })

   it('should return same values', () => {
      expect(pool).toEqual({
         id: prismaPool.id,
         question: prismaPool.question,
         expiresAt: prismaPool.expiresAt,
      })
   })
})
