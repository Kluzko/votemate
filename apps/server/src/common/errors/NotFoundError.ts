type Entity = 'Pool'

export class NotFoundError extends Error {
   constructor(entity: Entity) {
      super(`${entity} not found`)
   }
}
