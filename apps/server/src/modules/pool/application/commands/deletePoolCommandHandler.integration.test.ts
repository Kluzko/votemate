import { faker } from '@faker-js/faker'
import { ContainerSingleton } from 'container'
import { type Pool } from 'modules/pool/domain/entities'
import { beforeAll, describe, expect, it } from 'vitest'

import { NotFoundError } from 'common/errors'

import { type CreatePool } from 'modules/pool/api/schemas'

import { type PoolRepository } from 'modules/pool/infrastructure/repositories'

import { symbols } from '../../symbols'

import { type DeletePoolCommandHandler } from './deletePoolCommandHandler'

describe('DeletePoolCommandHandler', () => {
   let deletePoolCommandHandler: DeletePoolCommandHandler
   let poolRepository: PoolRepository
   let createdPool: Pool
   let payload: CreatePool

   beforeAll(() => {
      const container = ContainerSingleton.getInstance()
      deletePoolCommandHandler = container.get(symbols.deletePoolCommandHandler)
      poolRepository = container.get(symbols.poolRepository)
   })

   describe('.execute', () => {
      beforeAll(async () => {
         payload = {
            question: faker.lorem.sentence(),
            expiresAt: faker.date.soon(3),
         }

         const result = await poolRepository.createPool(payload)
         createdPool = result.pool
      })

      it('should delete the pool', async () => {
         await deletePoolCommandHandler.execute({ id: createdPool.getId() })

         try {
            await poolRepository.getPool({ id: createdPool.getId() })
         } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError)
         }
      })
   })
})
