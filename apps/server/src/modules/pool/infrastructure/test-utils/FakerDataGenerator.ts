import { faker } from '@faker-js/faker'

import { type Answer, type PoolData } from './PoolData'

export function generateBaseData(): Omit<PoolData, 'answers'> {
   return {
      id: faker.datatype.uuid(),
      userId: faker.datatype.uuid(),
      question: faker.lorem.sentence(),
      expiresAt: faker.date.soon(3),
      isPublic: true,
      password: faker.internet.password(),
   }
}

export function generateAnswer(): Answer {
   return {
      value: faker.lorem.sentence(),
      votes: Array.from({ length: 5 }, () => ({ voterId: faker.datatype.uuid() })),
   }
}
