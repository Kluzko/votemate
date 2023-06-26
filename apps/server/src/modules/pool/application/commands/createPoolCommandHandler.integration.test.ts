import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { Pool } from 'modules/pool/domain/entities'
import { beforeAll, describe, expect, it } from 'vitest'

import { InvalidInputError } from 'common/errors'

import { type CreatePool } from 'modules/pool/api/schemas'

import { symbols } from '../../symbols'

import { type CreatePoolCommandHandler } from './createPoolCommandHandler'

describe('CreatePoolCommandHandler', () => {
   let createPoolCommandHandler: CreatePoolCommandHandler

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()

      createPoolCommandHandler = container.get(symbols.createPoolCommandHandler)
   })

   describe('Given valid Pool', () => {
      let payload: CreatePool

      beforeAll(() => {
         const pool = new Pool({
            question: faker.lorem.sentence(),
            expiresAt: faker.date.soon(3),
            answers: faker.lorem.sentences(4).split('.').filter(Boolean),
         })

         payload = {
            question: pool.getQuestion(),
            expiresAt: pool.getExpiresAt(),
            answers: pool.getAnswers(),
         }
      })

      describe('.execute', () => {
         let result: { pool: Pool }

         beforeAll(async () => {
            result = await createPoolCommandHandler.execute(payload)
         })

         it('should have a valid Pool', () => {
            expect(result.pool).toBeInstanceOf(Pool)
         })

         it('should have the correct question', () => {
            expect(result.pool.getQuestion()).toEqual(payload.question)
         })

         it('should have the correct expiration date', () => {
            expect(result.pool.getExpiresAt()).toEqual(payload.expiresAt)
         })

         it('should have the correct answers', () => {
            expect(result.pool.getAnswers()).toEqual(payload.answers)
         })
      })
   })

   describe('Given invalid Pool', () => {
      let payload: CreatePool

      beforeAll(() => {
         payload = {
            question: '',
            expiresAt: new Date(),
            answers: [],
         }
      })

      describe('.execute', () => {
         it('should throw InvalidInputError for an empty question', async () => {
            try {
               await createPoolCommandHandler.execute(payload)
            } catch (error) {
               expect(error).toBeInstanceOf(InvalidInputError)
            }
         })
      })
   })
})
