import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { type Pools } from 'types'

const fetchPools = async () => {
   try {
      const response = await axios.get('/api/user/pools')
      return response.data
   } catch (error) {
      console.log(error)
   }
}

export const useGetUserPools = () => {
   const { data, isLoading } = useQuery<Pools>(['userPools'], fetchPools)

   return {
      pools: data?.pools,
      isLoading,
   }
}
