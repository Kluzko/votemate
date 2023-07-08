import { type PoolData } from 'modules/pool/api/schemas'

export class Pool {
   private readonly id: string
   private readonly question: string
   private readonly expiresAt: Date
   private readonly answers: {
      value: string
      id: string
   }[]
   private readonly isPublic: boolean
   private readonly password?: string

   constructor({ id, question, expiresAt, answers, isPublic, password }: PoolData) {
      this.id = id
      this.question = question
      this.expiresAt = expiresAt
      this.answers = answers
      this.isPublic = isPublic
      this.password = password
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

   public getAnswers() {
      return this.answers
   }

   public getIsPublic() {
      return this.isPublic
   }

   public getPassword() {
      return this.password
   }
}
