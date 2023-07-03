import axios from 'axios'

export const useLogin = async (email: string) => {
   try {
      await axios.post('/api/login', { email })

      window.navigate({ to: '/emailVerification' })
   } catch (error) {
      console.log(error)
   }
}
