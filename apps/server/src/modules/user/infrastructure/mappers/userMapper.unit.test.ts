import { faker } from '@faker-js/faker'
import { type User as PrismaUser } from '@prisma/client'
import { ContainerSingleton } from 'container'
import { beforeAll, describe, expect, it } from 'vitest'

import { User } from 'modules/user/domain/entities'

import { symbols } from 'modules/user/symbols'

import { type UserMapper } from './userMapper'

describe('UserMapper', () => {
   let userMapper: UserMapper
   let user: User
   let prismaUser: PrismaUser

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()

      userMapper = container.get(symbols.userMapper)

      prismaUser = {
         id: faker.datatype.uuid(),
         email: faker.internet.email(),
         createdAt: new Date(),
         updatedAt: new Date(),
      }
      user = userMapper.map(prismaUser)
   })

   it('should map PrismaUser to User', () => {
      expect(user).toBeInstanceOf(User)
   })

   it('should return same values', () => {
      expect(user.getId()).toEqual(prismaUser.id)
      expect(user.getEmail()).toEqual(prismaUser.email)
   })
})
