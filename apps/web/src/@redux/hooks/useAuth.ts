import { authActions } from '@redux/reducers/auth'

import { useAction } from './useAction'
import { useSelector } from './useSelector'

export const useAuth = () => {
   const { isAuthenticated } = useSelector(({ auth }) => auth)

   const setIsAuthenticated = useAction(authActions.setIsAuthenticated)

   return {
      isAuthenticated,
      setIsAuthenticated,
   }
}
