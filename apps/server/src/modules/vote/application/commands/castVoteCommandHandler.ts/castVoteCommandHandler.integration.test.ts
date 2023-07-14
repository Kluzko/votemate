import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SocketIOService } from 'services'

import { CastVoteCommandHandler } from './castVoteCommandHandler'

describe('CastVoteCommandHandler', () => {
   let handler: CastVoteCommandHandler
   let mockVoteRepository: any
   let mockSocketIOService: any
   let payload: any

   beforeEach(() => {
      // Setup for each test
      mockVoteRepository = {
         hasVotedTwiceOnAnswer: vi.fn(),
         checkIfAnswerBelongsToPool: vi.fn(),
         findVoteInPoolByVoter: vi.fn(),
         updateVote: vi.fn(),
         createVote: vi.fn(),
      }

      vi.resetAllMocks()

      mockSocketIOService = { emitVote: vi.fn() }

      // Mocking the static method emitVote of SocketIOService
      vi.spyOn(SocketIOService, 'emitVote').mockImplementation(mockSocketIOService.emitVote)

      handler = new CastVoteCommandHandler(mockVoteRepository)

      payload = {
         poolId: faker.datatype.uuid(),
         voterId: faker.datatype.uuid(),
         answerId: faker.datatype.uuid(),
      }
   })

   it('should successfully cast a vote when voting for the first time', async () => {
      mockVoteRepository.hasVotedTwiceOnAnswer.mockResolvedValue(false)
      mockVoteRepository.checkIfAnswerBelongsToPool.mockResolvedValue(true)
      mockVoteRepository.findVoteInPoolByVoter.mockResolvedValue(null)

      await handler.execute(payload)

      expect(mockVoteRepository.hasVotedTwiceOnAnswer).toHaveBeenCalledWith(payload)
      expect(mockVoteRepository.checkIfAnswerBelongsToPool).toHaveBeenCalledWith(payload)
      expect(mockVoteRepository.findVoteInPoolByVoter).toHaveBeenCalledWith(payload)
      expect(mockVoteRepository.createVote).toHaveBeenCalledWith(payload)
      expect(SocketIOService.emitVote).toHaveBeenCalledWith(payload.poolId)
   })

   it('should throw an error when a user attempts to vote twice on the same answer', async () => {
      mockVoteRepository.hasVotedTwiceOnAnswer.mockResolvedValue(true)

      await expect(handler.execute(payload)).rejects.toThrow('You can only vote once on the same answer.')

      expect(mockVoteRepository.hasVotedTwiceOnAnswer).toHaveBeenCalledWith(payload)
   })

   it('should throw an error when a user votes on an answer that does not belong to the pool', async () => {
      mockVoteRepository.hasVotedTwiceOnAnswer.mockResolvedValue(false)
      mockVoteRepository.checkIfAnswerBelongsToPool.mockResolvedValue(false)

      await expect(handler.execute(payload)).rejects.toThrow('Answer does not exist in the current pool.')

      expect(mockVoteRepository.hasVotedTwiceOnAnswer).toHaveBeenCalledWith(payload)
      expect(mockVoteRepository.checkIfAnswerBelongsToPool).toHaveBeenCalledWith(payload)
   })

   it('should successfully update an existing vote', async () => {
      const existingVote = { vote: { getId: vi.fn().mockReturnValue(faker.datatype.uuid()) } }

      mockVoteRepository.hasVotedTwiceOnAnswer.mockResolvedValue(false)
      mockVoteRepository.checkIfAnswerBelongsToPool.mockResolvedValue(true)
      mockVoteRepository.findVoteInPoolByVoter.mockResolvedValue(existingVote)

      await handler.execute(payload)

      expect(mockVoteRepository.hasVotedTwiceOnAnswer).toHaveBeenCalledWith(payload)
      expect(mockVoteRepository.checkIfAnswerBelongsToPool).toHaveBeenCalledWith(payload)
      expect(mockVoteRepository.findVoteInPoolByVoter).toHaveBeenCalledWith(payload)
      expect(mockVoteRepository.updateVote).toHaveBeenCalledWith({
         voteId: existingVote.vote.getId(),
         answerId: payload.answerId,
      })
      expect(SocketIOService.emitVote).toHaveBeenCalledWith(payload.poolId)
   })
})
