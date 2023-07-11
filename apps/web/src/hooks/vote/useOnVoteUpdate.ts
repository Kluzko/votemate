import { useSocket } from '@redux/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useOnVoteUpdate = ({ poolId }: { poolId: string | undefined }) => {
   const { socket } = useSocket()
   const client = useQueryClient()
   if (!poolId) {
      throw new Error('poolId is null')
   }

   useEffect(() => {
      const handleVote = (voteId: string) => {
         console.log('votted')
         if (voteId === poolId) {
            client.invalidateQueries(['pool', poolId])
         }
      }

      socket?.on('voteCast', handleVote)

      return () => {
         socket?.off('voteCast', handleVote)
      }
   }, [socket, poolId, client])
}
