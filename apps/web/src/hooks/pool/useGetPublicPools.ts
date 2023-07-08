import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { type Pools } from 'types'

const fetchPools = async () => {
   try {
      const response = await axios.get('/api/pools')
      return response.data
   } catch (error) {
      console.log(error)
   }
}

export const useGetPublicPools = () => {
   const { data, isLoading } = useQuery<Pools>({
      queryKey: ['publicPools'],
      queryFn: fetchPools,
   })

   return {
      pools: data?.pools,
      isLoading,
   }
}
