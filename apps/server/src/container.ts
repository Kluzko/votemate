import { Container } from 'inversify'
import { UserModule } from 'modules/user/userModule'

import { PoolModule } from './modules/pool/poolModule'

export class ContainerSingleton extends Container {
   private static instance: ContainerSingleton

   private constructor() {
      super()
      UserModule.registerDependencies(this)
      PoolModule.registerDependencies(this)
   }

   public static getInstance(): ContainerSingleton {
      if (!this.instance) {
         this.instance = new ContainerSingleton()
      }
      return ContainerSingleton.instance
   }
}
