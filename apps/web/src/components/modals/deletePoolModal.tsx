import { Button, Modal } from 'components/shared'

type DeletePoolModalProps = {
   onClose: () => void
   title: string
}

export const DeletePoolModal = ({ onClose, title }: DeletePoolModalProps) => {
   return (
      <Modal onClose={onClose}>
         {' '}
         <h1 className="text-4xl font-lalezar py-10 ">Delete PooL</h1>
         <p className="text-graphite text-lg text-center">Are you sure you want delete</p>
         <p className="text-darkGray text-xl mt-5">{title} Pool ?</p>
         <div className="flex w-[24rem] mt-10 justify-between">
            <Button
               text="Cancel"
               background="bg-electricPurple"
               type="button"
               color="text-lightGray"
               onClick={onClose}
               width="w-44"
            />

            <Button text="Delete Pool" background="bg-tomatoRed" type="button" color="text-darkGray" width="w-44" />
         </div>
      </Modal>
   )
}
