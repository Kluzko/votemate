import { type Server as HttpServer } from 'http'
import { Server as IOServer, type Socket } from 'socket.io'

import { logger } from 'utils'

export class SocketIOService {
   private static io: IOServer | null = null
   private static timeouts = new Map<Socket, NodeJS.Timeout>()
   private static readonly idleTimeout = 60 * 60 * 1000 // 1h

   public static initialize(server: HttpServer) {
      if (this.io) {
         throw new Error('SocketIOService has already been initialized.')
      }

      this.io = new IOServer(server, { perMessageDeflate: true })

      this.io.on('connection', (socket: Socket) => {
         logger.info(`New user joined: ${socket.id}`)

         socket.on('disconnect', () => {
            logger.info(`Client disconnected: ${socket.id}`)
            clearTimeout(this.timeouts.get(socket) as NodeJS.Timeout)
            this.timeouts.delete(socket)
         })

         // Disconnecting idle clients
         this.resetTimeout(socket, this.idleTimeout)

         // Reset the disconnect timer on new events
         socket.onAny(() => {
            this.resetTimeout(socket, this.idleTimeout)
         })
      })

      logger.info('SocketIOService has been initialized.')
   }

   public static emitVote(voteId: string) {
      if (!this.io) {
         throw new Error('SocketIOService has not been initialized.')
      }

      this.io.emit('voteCast', voteId)
   }

   private static async resetTimeout(socket: Socket, idleTimeout: number) {
      if (this.timeouts.has(socket)) {
         clearTimeout(this.timeouts.get(socket) as NodeJS.Timeout)
      }

      const timeoutId = setTimeout(() => {
         logger.info(`Client disconnected due to inactivity: ${socket.id}`)
         socket.disconnect(true)
      }, idleTimeout)

      this.timeouts.set(socket, timeoutId)
   }
}
