import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchAuthStatus = async () => {
   try {
      const response = await axios.get('/api/auth')
      console.log(response)
      return response.data.isAuthenticated
   } catch (error) {
      return false
   }
}

export const useAuth = () => {
   const { data, isLoading } = useQuery({
      queryKey: ['authStatus'],
      queryFn: fetchAuthStatus,
   })

   console.log(data, isLoading)
   return {
      isAuthenticated: !!data,
      isLoading,
   }
}
