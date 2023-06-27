import { type PoolData } from 'modules/pool/api/schemas'

export class Pool {
   private id: string
   private question: string
   private expiresAt: Date

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
