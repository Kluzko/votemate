import { Container } from 'inversify'
import { PoolModule } from 'modules/pool/poolModule'
import { UserModule } from 'modules/user/userModule'
import { VoteModule } from 'modules/vote/voteModule'

export class ContainerSingleton extends Container {
   private static instance: ContainerSingleton

   private constructor() {
      super()
      UserModule.registerDependencies(this)
      PoolModule.registerDependencies(this)
      VoteModule.registerDependencies(this)
   }

   public static getInstance(): ContainerSingleton {
      if (!this.instance) {
         this.instance = new ContainerSingleton()
      }
      return ContainerSingleton.instance
   }
}
