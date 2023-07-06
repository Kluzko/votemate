import { modalActions } from '@redux/reducers/modals'

import { type Modals } from 'types'
import { useAction } from './useAction'
import { useDispatch } from './useDispatch'
import { useSelector } from './useSelector'

export const useModal = () => {
   const dispatch = useDispatch()

   const { modals } = useSelector(({ modals }) => modals)

   const openModal = (modal: Modals) => dispatch(modalActions.openModal({ modal }))

   const closeModal = useAction(modalActions.closeModal)

   return {
      modals,
      openModal,
      closeModal,
   }
}
