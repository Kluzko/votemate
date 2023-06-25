import { Container } from 'inversify'

import { PoolModule } from 'modules/pool/poolModule'

export class ContainerSingleton extends Container {
   private static instance: ContainerSingleton

   private constructor() {
      super()

      PoolModule.registerDependencies(this)
   }

   public static getInstance(): ContainerSingleton {
      if (!this.instance) {
         this.instance = new ContainerSingleton()
      }
      return ContainerSingleton.instance
   }
}
