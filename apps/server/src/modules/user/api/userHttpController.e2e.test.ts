import { sign } from 'jsonwebtoken'
import { app } from 'server'
import supertest from 'supertest'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { EmailService } from '../application/services'

describe('UserHttpController', () => {
   const email = 'tester@example.com'
   let emailToken: string
   let authToken: string

   beforeAll(async () => {
      emailToken = sign({ email }, process.env.JWT_SECRET)
      authToken = sign({ email }, process.env.JWT_SECRET, { expiresIn: '30d' })
   })

   describe('loginUser', () => {
      it('should execute the loginUserCommandHandler and return success response', async () => {
         const sendMagicLinkSpy = vi.spyOn(EmailService.prototype, 'sendMagicLink')

         const response = await supertest(app.server).post('/api/login').send({ email: 'delivered@resend.dev' })

         expect(response.status).toBe(200)
         expect(response.body).toEqual({
            success: true,
            email: 'delivered@resend.dev',
         })

         const [[sentEmail, emailToken]] = sendMagicLinkSpy.mock.calls

         expect(sendMagicLinkSpy).toHaveBeenCalledWith(sentEmail, emailToken)

         sendMagicLinkSpy.mockClear()
      })

      it('should return a 422 error if email is not provided', async () => {
         const response = await supertest(app.server).post('/api/login').send({})

         expect(response.status).toBe(422)
      })

      it('should return a 422 error if invalid email is provided', async () => {
         const response = await supertest(app.server).post('/api/login').send({ email: 'invalidEmail' })

         expect(response.status).toBe(422)
      })

      it('should return a 500 error if sending the magic link fails', async () => {
         const sendMagicLinkSpy = vi.spyOn(EmailService.prototype, 'sendMagicLink')
         sendMagicLinkSpy.mockImplementation(() => {
            throw new Error('Sending magic link failed')
         })

         const response = await supertest(app.server).post('/api/login').send({ email: 'delivered@resend.dev' })

         expect(response.status).toBe(500)

         sendMagicLinkSpy.mockRestore()
      })
   })

   describe('verifyUser', () => {
      it('should return success response, set auth token cookie, and call execute method of verifyUserQueryHandler', async () => {
         const response = await supertest(app.server).get('/api/verify').query({ emailToken })

         expect(response.status).toBe(200)
         expect(response.body).toEqual({ success: true })
         expect(response.headers['set-cookie'][0]).toContain('authToken')
      })

      it('should return an error when the token is invalid', async () => {
         const response = await supertest(app.server).get('/api/verify').query({ emailToken: 'invalidToken' })
         expect(response.status).toBe(401)
      })

      it('should return an error when no token is provided', async () => {
         const response = await supertest(app.server).get('/api/verify')
         expect(response.status).toBe(422)
      })

      it('should return an error when the token is signed with a different secret', async () => {
         const wrongSecretToken = sign({ email }, 'wrongSecret')
         const response = await supertest(app.server).get('/api/verify').query({ emailToken: wrongSecretToken })
         expect(response.status).toBe(401)
      })
   })

   describe('authUser', () => {
      it('should return user when valid token is provided', async () => {
         const response = await supertest(app.server)
            .get('/api/auth')
            .set('Cookie', [`authToken=${authToken}`])

         expect(response.status).toBe(200)
         expect(response.body.isAuthenticated).toEqual(true)
      })

      it('should return error when no token is provided', async () => {
         const response = await supertest(app.server).get('/api/auth')

         expect(response.status).toBe(404)
      })

      it('should return error when no user is found', async () => {
         const invalidToken = sign({ email: 'invalid@example.com' }, process.env.JWT_SECRET)

         const response = await supertest(app.server)
            .get('/api/auth')
            .set('Cookie', [`authToken=${invalidToken}`])

         expect(response.status).toBe(404)
      })
   })

   describe('logoutUser', () => {
      it('should clear auth token cookie', async () => {
         const response = await supertest(app.server)
            .post('/api/logout')
            .set('Cookie', [`authToken=${authToken}`])

         expect(response.status).toBe(200)
         expect(response.body).toEqual({ success: true })

         expect(response.headers['set-cookie'][0]).toEqual('authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
      })
   })
})
