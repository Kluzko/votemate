import { type TypedUseSelectorHook, useSelector as _useSelector } from 'react-redux'

import { type RootState } from '@redux'

export const useSelector: TypedUseSelectorHook<RootState> = _useSelector
