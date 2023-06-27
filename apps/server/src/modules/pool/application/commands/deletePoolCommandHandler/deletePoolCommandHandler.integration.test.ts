import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { beforeAll, describe, expect, it } from 'vitest'

import { NotFoundError } from 'common/errors'

import { type CreatePool } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { type Pool } from 'modules/pool/domain/entities'

import { symbols } from 'modules/pool/symbols'

import { type DeletePoolCommandHandler } from './deletePoolCommandHandler'

describe('DeletePoolCommandHandler', () => {
   let deletePoolCommandHandler: DeletePoolCommandHandler
   let poolRepository: PoolRepository

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()

      deletePoolCommandHandler = container.get(symbols.deletePoolCommandHandler)
      poolRepository = container.get(symbols.poolRepository)
   })

   describe('.execute', () => {
      let result: { pool: Pool }
      let payload: CreatePool

      beforeAll(async () => {
         payload = {
            question: faker.lorem.sentence(),
            expiresAt: faker.date.soon(3),
         }

         result = await poolRepository.createPool(payload)

         await deletePoolCommandHandler.execute({ id: result.pool.getId() })
      })

      it('Pool should be deleted', async () => {
         try {
            await poolRepository.getPool({ id: result.pool.getId() })
         } catch (error) {
            return expect(error).toBeInstanceOf(NotFoundError)
         }
         expect.fail()
      })
   })
})
