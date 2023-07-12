import { useAction, useSelector } from '@redux/hooks'
import { socketActions } from '@redux/reducers/socket'

export const useSocket = () => {
   const { socket } = useSelector(({ socket }) => socket)

   const setSocket = useAction(socketActions.setSocket)

   const closeSocketConnection = () => {
      socket?.disconnect()
      setSocket(null)
   }

   return {
      socket,
      setSocket,
      closeSocketConnection,
   }
}
