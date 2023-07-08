import { useModal } from '@redux/hooks'
import { Button, Modal } from 'components/shared'
import { useDeletePool } from 'hooks/pool'
import { type Pool } from 'types'

type DeletePoolModalProps = Pick<Pool, 'question' | 'id'>

export const DeletePoolModal = ({ question, id }: DeletePoolModalProps) => {
   const { deletePool, isLoading } = useDeletePool()

   const { closeModal } = useModal()

   return (
      <Modal modal="deletePoolModal">
         <h1 className="text-4xl font-lalezar py-10 ">Delete PooL</h1>
         <p className="text-graphite text-lg text-center">Are you sure you want delete</p>
         <p className="text-darkGray text-xl mt-5">{question} Pool ?</p>
         <div className="flex w-[24rem] mt-10 justify-between">
            <Button
               text="Cancel"
               background="bg-electricPurple"
               type="button"
               color="text-lightGray"
               onClick={() => closeModal('deletePoolModal')}
               width="w-44"
            />

            <Button
               text="Delete Pool"
               background="bg-tomatoRed"
               type="button"
               color="text-darkGray"
               width="w-44"
               onClick={() => deletePool(id)}
               isLoading={isLoading}
            />
         </div>
      </Modal>
   )
}
