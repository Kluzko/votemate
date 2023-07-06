import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { auth } from './auth'
import { modals } from './modals'

export const rootReducer = combineReducers({
   auth: persistReducer(
      {
         key: 'auth',
         storage,
      },
      auth
   ),

   modals,
})
