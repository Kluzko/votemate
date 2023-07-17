type Entity = 'Pool' | 'Token' | 'User'

export class NotFoundError extends Error {
   constructor(entity: Entity) {
      super(`${entity} not found`)
   }
}
