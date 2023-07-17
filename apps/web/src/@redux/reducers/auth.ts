import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

type AuthState = {
   isAuthenticated: boolean
}

const initialState: AuthState = { isAuthenticated: false }

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      setIsAuthenticated: (state, { payload }: PayloadAction<boolean>) => {
         state.isAuthenticated = payload
      },
   },
})

export const { ...authActions } = authSlice.actions

export const auth = authSlice.reducer
