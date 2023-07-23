import { store } from '@redux'

import { authActions } from '@redux/reducers/auth'

export const setIsAuthenticated = (isAuthenticated: boolean) => {
   store.dispatch(authActions.setIsAuthenticated(isAuthenticated))
}
