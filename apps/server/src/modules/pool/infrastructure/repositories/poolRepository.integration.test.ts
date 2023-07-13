import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { prisma } from 'prisma'

import { NotFoundError } from 'common/errors'

import {
   type CreatePool,
   type PrismaPoolWithAnswers,
   type PrismaPoolWithAnswersAndVotes,
} from 'modules/pool/api/schemas'

import { Pool } from 'modules/pool/domain/entities'

import { symbols } from 'modules/pool/symbols'

import { mockPoolData } from '../test-utils'
import { type PoolRepository } from './poolRepository'

describe('PoolRepository', () => {
   let poolRepository: PoolRepository

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()
      poolRepository = container.get(symbols.poolRepository)
   })

   describe('createPool', () => {
      let createdPool: Pool
      const payload: CreatePool = mockPoolData.createBasePoolData()

      beforeAll(async () => {
         const result = await poolRepository.createPool(payload)
         createdPool = result.pool
      })

      afterAll(async () => {
         await prisma.pool.delete({ where: { id: createdPool.getId() } })
      })

      it('Should return a Pool instance', () => {
         expect(createdPool).toBeInstanceOf(Pool)
      })

      it('Should return valid data', () => {
         expect(createdPool.getId()).toBeDefined()
         expect(createdPool.getQuestion()).toEqual(payload.question)
         expect(createdPool.getExpiresAt().toISOString()).toEqual(payload.expiresAt.toISOString())
         expect(createdPool.getIsPublic()).toEqual(payload.isPublic)
         createdPool.getAnswers().forEach(answer => {
            expect(payload.answers).toContain(answer.value)
         })
      })
   })

   describe('deletePool', () => {
      let mockPool: PrismaPoolWithAnswers

      beforeAll(async () => {
         const payload = mockPoolData.createBasePoolData()
         mockPool = await prisma.pool.create({
            data: {
               ...payload,
               answers: { createMany: { data: payload.answers.map(value => ({ value })) } },
            },
            include: { answers: true },
         })
      })

      it('should delete a pool and its associated answers', async () => {
         const result = await poolRepository.deletePool({
            id: mockPool.id,
            userId: mockPool.userId,
         })

         expect(result.pool).toMatchObject({
            id: mockPool.id,
            question: mockPool.question,
            expiresAt: mockPool.expiresAt,
            isPublic: mockPool.isPublic,
            answers: mockPool.answers.map(({ id, value }) => ({
               id,
               value,
            })),
            password: mockPool.password,
         })

         const deletedPool = await prisma.pool.findFirst({ where: { id: mockPool.id } })
         const deletedAnswers = await prisma.answer.findMany({ where: { poolId: mockPool.id } })

         expect(deletedPool).toBeNull()
         expect(deletedAnswers).toHaveLength(0)
      })

      it('should throw NotFoundError when the pool does not exist', async () => {
         const fakeUserId = faker.datatype.uuid()
         const fakeId = faker.datatype.uuid()

         await expect(
            poolRepository.deletePool({
               id: fakeId,
               userId: fakeUserId,
            })
         ).rejects.toThrow(NotFoundError)
      })
   })

   describe('updatePool', () => {
      let mockPool: PrismaPoolWithAnswers

      beforeEach(async () => {
         const payload = mockPoolData.createBasePoolData()
         mockPool = await prisma.pool.create({
            data: {
               ...payload,
               answers: { createMany: { data: payload.answers.map(value => ({ value })) } },
            },
            include: { answers: true },
         })
      })

      afterEach(async () => {
         await prisma.pool.delete({ where: { id: mockPool.id } })
      })

      it('should update existing answers', async () => {
         const newAnswers = mockPool.answers.map((answer, i) => (i % 2 === 0 ? faker.lorem.sentence() : answer.value))
         const updatedPool = await poolRepository.updatePool({
            id: mockPool.id,
            userId: mockPool.userId,
            answers: newAnswers,
         })

         expect(updatedPool.pool.getAnswers().map(answer => answer.value)).toEqual(newAnswers)
      })

      it('should delete existing answers if not provided in the new answers', async () => {
         const newAnswers = mockPool.answers.slice(0, mockPool.answers.length / 2).map(answer => answer.value)
         const updatedPool = await poolRepository.updatePool({
            id: mockPool.id,
            userId: mockPool.userId,
            answers: newAnswers,
         })

         expect(updatedPool.pool.getAnswers().map(answer => answer.value)).toEqual(newAnswers)
      })

      it('should create new answers if not present in the existing answers', async () => {
         const newAnswers = [
            ...mockPool.answers.map(answer => answer.value),
            faker.lorem.sentence(),
            faker.lorem.sentence(),
         ]
         const updatedPool = await poolRepository.updatePool({
            id: mockPool.id,
            userId: mockPool.userId,
            answers: newAnswers,
         })

         const sortedUpdatedAnswers = [...updatedPool.pool.getAnswers().map(answer => answer.value)].sort()
         const sortedNewAnswers = [...newAnswers].sort()

         expect(sortedUpdatedAnswers).toEqual(sortedNewAnswers)
      })

      it('should update other pool details', async () => {
         const payload = {
            ...mockPoolData.createBasePoolData(),
            id: mockPool.id,
            userId: mockPool.userId,
         }
         const updatedPool = await poolRepository.updatePool(payload)

         expect(updatedPool.pool.getQuestion()).toEqual(payload.question)
         expect(updatedPool.pool.getExpiresAt()).toEqual(payload.expiresAt)
         expect(updatedPool.pool.getIsPublic()).toEqual(payload.isPublic)
         expect(updatedPool.pool.getPassword()).toEqual(payload.password)
      })

      it('should throw NotFoundError if pool does not exist', async () => {
         const payload = {
            ...mockPoolData.createBasePoolData(),
            id: faker.datatype.uuid(),
            userId: mockPool.userId,
         }

         await expect(poolRepository.updatePool(payload)).rejects.toThrow(NotFoundError)
      })

      it('should throw NotFoundError if user does not exist', async () => {
         const payload = {
            ...mockPoolData.createBasePoolData(),
            id: mockPool.id,
            userId: faker.datatype.uuid(),
         }

         await expect(poolRepository.updatePool(payload)).rejects.toThrow(NotFoundError)
      })
   })

   describe('getPool', () => {
      let mockPool: PrismaPoolWithAnswersAndVotes
      let voterId: string

      beforeEach(async () => {
         voterId = faker.datatype.uuid()
         const poolPayload = mockPoolData.createBasePoolData()

         // Create pool
         mockPool = await prisma.pool.create({
            data: {
               ...poolPayload,
               answers: {
                  create: poolPayload.answers.map(value => ({
                     value,
                     votes: { create: { voterId } },
                  })),
               },
            },
            include: { answers: { include: { votes: true } } },
         })
      })

      afterEach(async () => {
         await prisma.pool.delete({ where: { id: mockPool.id } })
      })

      it('should return the pool with answer vote counts and votedAnswerId', async () => {
         const { pool } = await poolRepository.getPool({
            id: mockPool.id,
            voterId,
         })

         expect(pool.id).toEqual(mockPool.id)
         expect(pool.question).toEqual(mockPool.question)
         expect(pool.expiresAt).toEqual(mockPool.expiresAt)
         expect(pool.isPublic).toEqual(mockPool.isPublic)
         expect(pool.password).toEqual(mockPool.password)

         expect(pool.voteCounts).toBeDefined()
         expect(pool.voteCounts).toEqual(expect.any(Object))

         // Now we can expect that there will be an answer the user voted on.
         expect(pool.votedAnswerId).toBeDefined()
         let votedAnswerId: string | null = null

         mockPool.answers.forEach(answer => {
            const vote = answer.votes.find(vote => vote.voterId === voterId)
            if (vote) {
               votedAnswerId = vote.answerId
            }
         })

         expect(pool.votedAnswerId).toEqual(votedAnswerId)
      })

      it('should throw NotFoundError when the pool does not exist', async () => {
         const fakeId = faker.datatype.uuid()
         const fakeVoterId = faker.datatype.uuid()

         await expect(
            poolRepository.getPool({
               id: fakeId,
               voterId: fakeVoterId,
            })
         ).rejects.toThrow(NotFoundError)
      })
   })

   describe('getUserPools', () => {
      let mockPools: PrismaPoolWithAnswersAndVotes[] = []
      const fakeUserId = faker.datatype.uuid()

      beforeEach(async () => {
         for (let i = 0; i < 2; i++) {
            const payload = mockPoolData.createPoolWithVotesData()
            const mockPool = await prisma.pool.create({
               data: {
                  ...payload,
                  userId: fakeUserId,
                  answers: {
                     create: payload.answers.map(answer => ({
                        value: answer.value,
                        votes: { create: answer.votes },
                     })),
                  },
               },
               include: { answers: { include: { votes: true } } },
            })
            mockPools.push(mockPool)
         }
      })

      afterEach(async () => {
         await prisma.pool.deleteMany({ where: { userId: fakeUserId } })
         mockPools = []
      })

      it('should return the user pools with total vote counts', async () => {
         const result = await poolRepository.getUserPools({ userId: fakeUserId })

         expect(result.pools.length).toEqual(mockPools.length)
         result.pools.forEach(pool => {
            const [correspondingMockPool] = mockPools.filter(p => p.id === pool.id)

            expect(correspondingMockPool).toBeDefined()

            const expectedTotalVotes = correspondingMockPool.answers.reduce(
               (acc, answer) => acc + answer.votes.length,
               0
            )

            expect(pool.id).toEqual(correspondingMockPool.id)
            expect(pool.question).toEqual(correspondingMockPool.question)
            expect(pool.expiresAt).toEqual(correspondingMockPool.expiresAt)
            expect(pool.isPublic).toEqual(correspondingMockPool.isPublic)
            expect(pool.totalVotes).toEqual(expectedTotalVotes)
         })
      })

      it('should throw NotFoundError when no pool exists for the user', async () => {
         const nonExistingUserId = faker.datatype.uuid()

         await expect(poolRepository.getUserPools({ userId: nonExistingUserId })).rejects.toThrow(NotFoundError)
      })
   })
   describe('getPublicPools', () => {
      let mockPools: PrismaPoolWithAnswersAndVotes[] = []

      beforeEach(async () => {
         for (let i = 0; i < 2; i++) {
            const payload = mockPoolData.createBasePoolData()
            const isPublic = i !== 0 // Set the first pool as private
            const mockPool = await prisma.pool.create({
               data: {
                  ...payload,
                  isPublic,
                  answers: { createMany: { data: payload.answers.map(value => ({ value })) } },
               },
               include: { answers: { include: { votes: true } } },
            })
            mockPools.push(mockPool)
         }
      })

      afterEach(async () => {
         await prisma.pool.deleteMany({ where: { id: { in: mockPools.map(pool => pool.id) } } })
         mockPools = []
      })

      it('should only return public pools', async () => {
         const result = await poolRepository.getPublicPools()

         expect(result.pools.length).toEqual(mockPools.length - 1)
         result.pools.forEach(pool => {
            expect(pool.isPublic).toBe(true)
         })
      })

      it('should throw NotFoundError when no public pools exist', async () => {
         // Set all pools as private
         await prisma.pool.updateMany({
            where: { id: { in: mockPools.map(pool => pool.id) } },
            data: { isPublic: false },
         })

         await expect(poolRepository.getPublicPools()).rejects.toThrow(NotFoundError)
      })
   })
})
