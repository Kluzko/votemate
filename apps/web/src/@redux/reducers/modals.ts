import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type Modals } from 'types'

type ModalsState = {
   modals: Modals[]
}

type OpenModalPayload = PayloadAction<{
   modal: Modals
}>

const initialState: ModalsState = { modals: [] }

const modalsSlice = createSlice({
   name: 'modals',
   initialState,
   reducers: {
      openModal: (state, { payload }: OpenModalPayload) => {
         state.modals.push(payload.modal)
      },
      closeModal: (state, { payload }: PayloadAction<Modals>) => {
         state.modals = state.modals.filter(modal => modal !== payload)
      },
   },
})

export const { ...modalActions } = modalsSlice.actions

export const modals = modalsSlice.reducer
