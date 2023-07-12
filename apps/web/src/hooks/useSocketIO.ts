import { useSocket } from '@redux/hooks'
import { useEffect } from 'react'
import io from 'socket.io-client'

export const useSocketIO = () => {
   const { setSocket } = useSocket()

   useEffect(() => {
      const socketInstance = io('/')

      socketInstance.on('connect', () => {
         console.log('Connected to the server')
      })

      socketInstance.on('disconnect', () => {
         console.log('Disconnected from the server')
      })

      socketInstance.on('reconnect', () => {
         console.log('Reconnected to server')
      })

      socketInstance.on('connect_error', error => {
         console.error('Connection error:', error)
      })
      setSocket(socketInstance)
   }, [])
}
