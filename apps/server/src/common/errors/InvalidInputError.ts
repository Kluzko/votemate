import { type ZodIssue } from 'zod'

export class InvalidInputError extends Error {
   public readonly issues: string[]

   constructor(issues: ZodIssue[]) {
      super()

      this.issues = issues.map(({ path, message }) => `Invalid value '${path[0]}': ${message} `)
   }
}
