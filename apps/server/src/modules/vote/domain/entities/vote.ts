import { type VoteData } from 'modules/vote/api/schemas'

export class Vote {
   private readonly id: string
   private readonly answerId: string
   private readonly voterId: string

   constructor({ id, answerId, voterId }: VoteData) {
      this.id = id
      this.answerId = answerId
      this.voterId = voterId
   }

   public getId() {
      return this.id
   }

   public getAnswerId() {
      return this.answerId
   }

   public getVoterId() {
      return this.voterId
   }
}
