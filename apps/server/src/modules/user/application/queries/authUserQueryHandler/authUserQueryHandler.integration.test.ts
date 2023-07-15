import { sign } from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { NotFoundError } from 'common/errors'

import { AuthUserQueryHandler } from './authUserQueryHandler'

describe('AuthUserQueryHandler', () => {
   let userRepository: any
   let authUserQueryHandler: AuthUserQueryHandler

   beforeEach(() => {
      userRepository = { findUser: vi.fn() }

      vi.resetAllMocks()

      authUserQueryHandler = new AuthUserQueryHandler(userRepository)
   })

   it('should execute successfully when valid authToken is provided', async () => {
      const email = 'test@example.com'
      const authToken = sign({ email }, process.env.JWT_SECRET)

      const user = {
         id: 1,
         email: 'test@example.com',
      }
      vi.spyOn(userRepository, 'findUser').mockResolvedValue(user)

      await expect(authUserQueryHandler.execute({ authToken })).resolves.not.toThrow()

      expect(userRepository.findUser).toHaveBeenCalledWith({ email })
   })

   it('should throw NotFoundError when authToken is not provided', async () => {
      const authToken = ''

      await expect(authUserQueryHandler.execute({ authToken })).rejects.toThrowError(NotFoundError)
      expect(userRepository.findUser).not.toHaveBeenCalled()
   })

   it('should throw NotFoundError when user is not found', async () => {
      const email = 'test@example.com'
      const authToken = sign({ email }, process.env.JWT_SECRET)

      vi.spyOn(userRepository, 'findUser').mockResolvedValue(null)

      await expect(authUserQueryHandler.execute({ authToken })).rejects.toThrowError(NotFoundError)

      expect(userRepository.findUser).toHaveBeenCalledWith({ email })
   })
})
