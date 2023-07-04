import { faker } from '@faker-js/faker'
import { type Answer as AnswerPool, type Pool as PrismaPool } from '@prisma/client'
import { ContainerSingleton } from 'container'
import { beforeAll, describe, expect, it } from 'vitest'

import { Pool } from 'modules/pool/domain/entities'

import { symbols } from 'modules/pool/symbols'

import { type PoolMapper } from './poolMapper'

type PoolMapperInput = PrismaPool & { answers: AnswerPool[] }

describe('PoolMapper', () => {
   let poolMapper: PoolMapper
   let pool: Pool
   let prismaPool: PoolMapperInput

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()

      poolMapper = container.get(symbols.poolMapper)

      prismaPool = {
         id: faker.datatype.uuid(),
         createdAt: new Date(),
         updatedAt: new Date(),
         expiresAt: faker.date.future(),
         question: 'Test',
         answers: [...Array(5)].map(() => ({
            id: faker.datatype.uuid(),
            createdAt: new Date(),
            updatedAt: new Date(),
            value: faker.lorem.sentence(),
            poolId: faker.datatype.uuid(),
         })),
         isPublic: true,
         password: null,
         userId: null,
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
         answers: prismaPool.answers.map(({ value }) => value),
         isPublic: prismaPool.isPublic,
      })
   })
})
