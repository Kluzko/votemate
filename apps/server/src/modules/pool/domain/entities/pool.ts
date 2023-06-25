import { type CreatePool } from 'modules/pool/api/schemas'

export class Pool {
   private question: string
   private expiresAt: Date
   private answers: string[]

   constructor({ question, answers, expiresAt }: CreatePool) {
      this.question = question
      this.expiresAt = expiresAt
      this.answers = answers
   }

   public getQuestion(): string {
      return this.question
   }

   public getExpiresAt(): Date {
      return this.expiresAt
   }

   public getAnswers(): string[] {
      return this.answers
   }
}
