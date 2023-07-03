import { type UserData } from 'modules/user/api/schemas'

export class User {
   private readonly id: string
   private readonly email: string

   constructor({ id, email }: UserData) {
      this.id = id
      this.email = email
   }

   public getId() {
      return this.id
   }

   public getEmail() {
      return this.email
   }
}
