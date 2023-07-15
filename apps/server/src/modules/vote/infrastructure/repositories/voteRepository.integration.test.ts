import { faker } from '@faker-js/faker'
import { type Answer, type Pool } from '@prisma/client'
import { ContainerSingleton } from 'container'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { prisma } from 'prisma'

import { symbols } from 'modules/vote/symbols'

import { type VoteRepository } from './voteRepository'

describe('VoteRepository', () => {
   let voteRepository: VoteRepository
   let prismaPool: Pool & { answers: Answer[] }
   let answerIds: string[]

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()
      voteRepository = container.get(symbols.voteRepository)
   })

   beforeEach(async () => {
      prismaPool = await prisma.pool.create({
         data: {
            question: 'Test',
            isPublic: true,
            expiresAt: new Date(),
            userId: faker.datatype.uuid(),
            answers: { create: [{ value: 'Test Answer 1' }, { value: 'Test Answer 2' }] },
         },
         include: { answers: true },
      })

      // Storing ids of created answers in an array
      answerIds = prismaPool.answers.map(answer => answer.id)
   })

   afterEach(async () => {
      await prisma.pool.deleteMany({ where: { id: prismaPool.id } })
   })

   describe('hasVotedTwiceOnAnswer', () => {
      const voterId = faker.datatype.uuid()

      afterEach(async () => {
         await prisma.vote.deleteMany({ where: { voterId } })
      })

      it('returns false when a user has not voted', async () => {
         const hasVotedTwice = await voteRepository.hasVotedTwiceOnAnswer({
            answerId: answerIds[0],
            voterId,
         })

         expect(hasVotedTwice).toBe(false)
      })

      it('returns true when a user has already voted', async () => {
         await prisma.vote.create({
            data: {
               answerId: answerIds[0],
               voterId,
            },
         })

         const hasVotedTwice = await voteRepository.hasVotedTwiceOnAnswer({
            answerId: answerIds[0],
            voterId,
         })

         expect(hasVotedTwice).toBe(true)
      })
   })

   describe('checkIfAnswerBelongsToPool', () => {
      let otherPool: Pool & { answers: Answer[] }

      beforeEach(async () => {
         otherPool = await prisma.pool.create({
            data: {
               question: 'Another Test',
               isPublic: true,
               expiresAt: new Date(),
               userId: faker.datatype.uuid(),
               answers: { create: [{ value: 'Another Test Answer' }] },
            },
            include: { answers: true },
         })
      })

      afterEach(async () => {
         await prisma.pool.deleteMany({ where: { id: otherPool.id } })
      })

      it('returns true when the answer belongs to the pool', async () => {
         const checkResult = await voteRepository.checkIfAnswerBelongsToPool({
            answerId: prismaPool.answers[0].id,
            poolId: prismaPool.id,
         })

         expect(checkResult).toBe(true)
      })

      it('returns false when the answer does not belong to the pool', async () => {
         const checkResult = await voteRepository.checkIfAnswerBelongsToPool({
            answerId: otherPool.answers[0].id,
            poolId: prismaPool.id,
         })

         expect(checkResult).toBe(false)
      })

      it('returns false when the answer does not exist', async () => {
         const nonExistentAnswerId = faker.datatype.uuid()
         const checkResult = await voteRepository.checkIfAnswerBelongsToPool({
            answerId: nonExistentAnswerId,
            poolId: prismaPool.id,
         })

         expect(checkResult).toBe(false)
      })
   })

   describe('findVoteInPoolByVoter', () => {
      let voterId: string
      let anotherVoterId: string

      beforeEach(async () => {
         voterId = faker.datatype.uuid()
         anotherVoterId = faker.datatype.uuid()

         await prisma.vote.createMany({
            data: [
               {
                  answerId: answerIds[0],
                  voterId,
               },
               {
                  answerId: answerIds[1],
                  voterId: anotherVoterId,
               },
            ],
         })
      })

      afterEach(async () => {
         await prisma.vote.deleteMany({ where: { OR: [{ voterId }, { voterId: anotherVoterId }] } })
      })

      it('returns the vote when a vote exists for the given voterId and poolId', async () => {
         const result = await voteRepository.findVoteInPoolByVoter({
            voterId,
            poolId: prismaPool.id,
         })

         expect(result).not.toBeNull()
         expect(result?.vote).toMatchObject({
            answerId: answerIds[0],
            voterId,
         })
      })

      it('returns null when no vote exists for the given voterId and poolId', async () => {
         const result = await voteRepository.findVoteInPoolByVoter({
            voterId: faker.datatype.uuid(),
            poolId: prismaPool.id,
         })

         expect(result).toBeNull()
      })
   })

   describe('createVote', () => {
      let voterId: string

      beforeEach(() => {
         voterId = faker.datatype.uuid()
      })

      it('creates a new vote', async () => {
         const result = await voteRepository.createVote({
            answerId: answerIds[0],
            voterId,
         })

         const createdVote = await prisma.vote.findUnique({ where: { id: result.vote.getId() } })

         expect(createdVote).not.toBeNull()
         expect(createdVote).toMatchObject({
            answerId: answerIds[0],
            voterId,
         })
      })
   })

   describe('updateVote', () => {
      let voterId: string
      let voteId: string

      beforeEach(async () => {
         voterId = faker.datatype.uuid()

         const createdVote = await prisma.vote.create({
            data: {
               answerId: answerIds[0],
               voterId,
            },
         })

         voteId = createdVote.id
      })

      afterEach(async () => {
         await prisma.vote.deleteMany({ where: { id: voteId } })
      })

      it('updates an existing vote', async () => {
         await voteRepository.updateVote({
            answerId: answerIds[1],
            voteId,
         })

         const updatedVote = await prisma.vote.findUnique({ where: { id: voteId } })

         expect(updatedVote).not.toBeNull()
         expect(updatedVote).toMatchObject({
            answerId: answerIds[1],
            voterId,
         })
      })
   })
})
