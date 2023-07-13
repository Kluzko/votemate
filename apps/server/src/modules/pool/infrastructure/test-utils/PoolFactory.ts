import { generateAnswer, generateBaseData } from './FakerDataGenerator'

export class PoolDataGenerator {
   createBasePoolData() {
      const basePoolData = generateBaseData()
      const answers = Array.from({ length: 5 }, () => generateAnswer().value)

      return {
         ...basePoolData,
         answers,
      }
   }

   createPoolWithVotesData() {
      const basePoolData = generateBaseData()
      const answers = Array.from({ length: 5 }, () => generateAnswer())

      return {
         ...basePoolData,
         answers,
      }
   }

   createBasePoolNoUserId() {
      const basePoolData = generateBaseData()
      const answers = Array.from({ length: 5 }, () => generateAnswer().value)

      //Find better soultion someday
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, ...basePoolDataNoUserId } = basePoolData

      return {
         ...basePoolDataNoUserId,
         answers,
      }
   }
}

export const mockPoolData = new PoolDataGenerator()
