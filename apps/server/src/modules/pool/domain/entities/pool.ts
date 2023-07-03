import { type PoolData } from 'modules/pool/api/schemas'

export class Pool {
   private readonly id: number
   private readonly question: string
   private readonly expiresAt: Date

   constructor({ id, question, expiresAt }: PoolData) {
      this.id = id
      this.question = question
      this.expiresAt = expiresAt
   }

   public getId() {
      return this.id
   }

   public getQuestion() {
      return this.question
   }

   public getExpiresAt() {
      return this.expiresAt
   }
}
