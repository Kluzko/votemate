import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { prisma } from 'prisma'

import { symbols } from 'modules/user/symbols'

import { type UserRepository } from './userRepository'

describe('UserRepository', () => {
   let userRepository: UserRepository
   let email: string

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()
      userRepository = container.get(symbols.userRepository)
   })

   beforeEach(() => {
      email = faker.internet.email()
   })

   afterEach(async () => {
      await prisma.user.deleteMany({ where: { email } })
   })

   describe('upsertUser', () => {
      it('creates a new user', async () => {
         const result = await userRepository.upsertUser({ email })
         const createdUser = await prisma.user.findUnique({ where: { id: result.user.getId() } })

         expect(createdUser).not.toBeNull()
         expect(createdUser?.email).toEqual(email)
      })

      it('should not create new user if it is with the same email', async () => {
         await prisma.user.create({ data: { email } })

         await userRepository.upsertUser({ email })

         const result = await prisma.user.findMany({ where: { email } })

         expect(result).not.toBeNull
         expect(result.length).toEqual(1)
      })
   })

   describe('findUser', () => {
      it('returns the user when a user exists for the given email', async () => {
         await prisma.user.create({ data: { email } })

         const result = await userRepository.findUser({ email })

         expect(result).not.toBeNull()
         expect(result?.user.getEmail()).toEqual(email)
      })

      it('returns null when no user exists for the given email', async () => {
         const result = await userRepository.findUser({ email })

         expect(result).toBeNull()
      })
   })
})
