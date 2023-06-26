import { type CreatePool } from '../../api/schemas'

export class Pool {
   private question: string
   private expiresAt: Date

   constructor({ question, expiresAt }: CreatePool) {
      this.question = question
      this.expiresAt = expiresAt
   }

   public getQuestion() {
      return this.question
   }

   public getExpiresAt() {
      return this.expiresAt
   }
}
