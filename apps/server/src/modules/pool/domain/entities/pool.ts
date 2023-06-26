import { type CreatePool } from '../../api/schemas'

export class Pool {
   private question: string
   private expiresAt: Date
   private answers: string[]

   constructor({ question, answers, expiresAt }: CreatePool) {
      this.question = question
      this.expiresAt = expiresAt
      this.answers = answers
   }

   public getQuestion() {
      return this.question
   }

   public getExpiresAt() {
      return this.expiresAt
   }

   public getAnswers() {
      return this.answers
   }
}
