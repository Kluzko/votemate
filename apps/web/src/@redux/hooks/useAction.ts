import { type AnyAction } from '@reduxjs/toolkit'

import { useDispatch } from './useDispatch'

export const useAction = <TAction extends (...args: Parameters<TAction>) => AnyAction>(action: TAction) => {
   const dispatch = useDispatch()
   return (...args: Parameters<typeof action>) => dispatch(action(...args))
}
