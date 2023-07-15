import { sign } from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { VerifyUserQueryHandler } from './verifyUserQueryHandler'

describe('VerifyUserQueryHandler', () => {
   let userRepository: any
   let verifyUserQueryHandler: VerifyUserQueryHandler

   beforeEach(() => {
      userRepository = { upsertUser: vi.fn() }

      vi.resetAllMocks()

      verifyUserQueryHandler = new VerifyUserQueryHandler(userRepository)
   })

   it('should execute and return an authentication token', async () => {
      const emailToken = sign({ email: 'fajny@mail.com' }, process.env.JWT_SECRET)

      vi.spyOn(userRepository, 'upsertUser').mockResolvedValue({})

      const result = await verifyUserQueryHandler.execute({ emailToken })

      expect(userRepository.upsertUser).toHaveBeenCalled()
      expect(result).toHaveProperty('authToken')
   })

   it('should handle error when upsertUser fails', async () => {
      const emailToken = sign({ email: 'fajny@mail.com' }, process.env.JWT_SECRET)

      const mockError = new Error('Upsert user failed')
      vi.spyOn(userRepository, 'upsertUser').mockRejectedValue(mockError)

      await expect(verifyUserQueryHandler.execute({ emailToken })).rejects.toThrowError(mockError)
   })

   it('should handle invalid emailToken', async () => {
      const invalidEmailToken = 'invalidToken'
      await expect(verifyUserQueryHandler.execute({ emailToken: invalidEmailToken })).rejects.toThrow()
   })

   it('should handle expired emailToken', async () => {
      const expiredEmailToken = sign({ email: 'expired@mail.com' }, process.env.JWT_SECRET, { expiresIn: '0s' })
      await expect(verifyUserQueryHandler.execute({ emailToken: expiredEmailToken })).rejects.toThrow()
   })
})
