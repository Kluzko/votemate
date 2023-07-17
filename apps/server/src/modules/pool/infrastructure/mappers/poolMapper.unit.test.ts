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
         userId: faker.datatype.uuid(),
      }
      pool = poolMapper.map(prismaPool)
   })

   it('should map PrismaPool to Pool', () => {
      expect(pool).toBeInstanceOf(Pool)
   })

   it('should return same values', () => {
      expect(pool.getId()).toEqual(prismaPool.id)
      expect(pool.getQuestion()).toEqual(prismaPool.question)
      expect(pool.getExpiresAt()).toEqual(prismaPool.expiresAt)
      expect(pool.getIsPublic()).toEqual(prismaPool.isPublic)
      expect(pool.getPassword()).toEqual(prismaPool.password ? prismaPool.password : undefined)

      const answers = pool.getAnswers()
      expect(answers.length).toEqual(prismaPool.answers.length)
      prismaPool.answers.forEach((answer, index) => {
         expect(answers[index]).toEqual({
            id: answer.id,
            value: answer.value,
         })
      })
   })
})
