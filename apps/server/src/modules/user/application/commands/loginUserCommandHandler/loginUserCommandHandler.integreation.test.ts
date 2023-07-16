import { sign, verify } from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'

import { LoginUserCommandHandler } from './loginUserCommandHandler'

describe('LoginUserCommandHandler', () => {
   let emailService: any
   let loginUserCommandHandler: LoginUserCommandHandler

   beforeEach(() => {
      emailService = { sendMagicLink: vi.fn() }

      vi.resetAllMocks()

      loginUserCommandHandler = new LoginUserCommandHandler(emailService)
   })

   it('should execute and call sendMagicLink with the correct email and token', async () => {
      const email = 'test@example.com'
      const emailToken = sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' })

      await loginUserCommandHandler.execute({ email })

      expect(emailService.sendMagicLink).toHaveBeenCalledWith(email, emailToken)
   })

   it('should throw an error if email is not provided', async () => {
      await expect(loginUserCommandHandler.execute({ email: '' })).rejects.toThrowError(ZodError)
      expect(emailService.sendMagicLink).not.toHaveBeenCalled()
   })
   it('should throw an error if bad email provided', async () => {
      await expect(loginUserCommandHandler.execute({ email: 'imbadmail@' })).rejects.toThrowError(ZodError)
      expect(emailService.sendMagicLink).not.toHaveBeenCalled()
   })

   it('should generate a valid email token with the correct expiration', async () => {
      const email = 'test@example.com'

      await loginUserCommandHandler.execute({ email })

      expect(emailService.sendMagicLink).toHaveBeenCalled()

      const [[sentEmail, emailToken]] = emailService.sendMagicLink.mock.calls

      const decodedToken: any = verify(emailToken, process.env.JWT_SECRET)
      expect(decodedToken.email).toEqual(email)
      expect(email).toEqual(sentEmail)

      // Verify the expiration
      const expiration = Math.floor(decodedToken.exp - decodedToken.iat)
      expect(expiration).toBe(600) // 10 minutes in seconds
   })
})
