import { faker } from '@faker-js/faker'
import { type Vote as PrismaVote } from '@prisma/client'
import { ContainerSingleton } from 'container'
import { beforeAll, describe, expect, it } from 'vitest'

import { Vote } from 'modules/vote/domain/entities'

import { symbols } from 'modules/vote/symbols'

import { type VoteMapper } from './voteMapper'

describe('VoteMapper', () => {
   let voteMapper: VoteMapper
   let vote: Vote
   let prismaVote: PrismaVote

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()

      voteMapper = container.get(symbols.voteMapper)

      prismaVote = {
         id: faker.datatype.uuid(),
         createdAt: new Date(),
         updatedAt: new Date(),
         answerId: faker.datatype.uuid(),
         voterId: faker.datatype.uuid(),
      }
      vote = voteMapper.map(prismaVote)
   })

   it('should map PrismaVote to Vote', () => {
      expect(vote).toBeInstanceOf(Vote)
   })

   it('should return same values', () => {
      expect(vote.getId()).toEqual(prismaVote.id)
      expect(vote.getAnswerId()).toEqual(prismaVote.answerId)
      expect(vote.getVoterId()).toEqual(prismaVote.voterId)
   })
})
