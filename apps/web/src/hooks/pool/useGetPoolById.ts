import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { type VoteCounts, type Pool } from 'types'

type PoolId = {
   id: string | undefined
}

const fetchPoolById = async ({ id }: PoolId) => {
   try {
      const response = await axios.get<{ pool: Pool & VoteCounts & { votedAnswerId: string } }>(`/api/pool/${id}`)
      return response.data
   } catch (error: any) {
      return {
         pool: null,
         error,
      }
   }
}

export const useGetPoolById = ({ id }: PoolId) => {
   const { data, isLoading } = useQuery(['pool', id], () => fetchPoolById({ id }), { enabled: id !== undefined })

   return {
      pool: data?.pool,
      isLoading,
   }
}
