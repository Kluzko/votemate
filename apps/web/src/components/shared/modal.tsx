import { useOutsideClick } from 'hooks'
import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { AiOutlineClose } from 'react-icons/ai'

const modalRoot = document.getElementById('modal-root') as HTMLElement

type ModalPortalProps = {
   children: React.ReactNode
   onClose: () => void
}

export const Modal = ({ onClose, children }: ModalPortalProps) => {
   const modalRef = useRef<HTMLDivElement>(null)
   useOutsideClick(modalRef, onClose)

   return ReactDOM.createPortal(
      <div className="fixed inset-0 bg-darkGray bg-opacity-50 flex items-center justify-center z-50">
         <div
            ref={modalRef}
            className="bg-lightGray container mx-auto relative py-16 rounded shadow-electricPurple flex flex-col items-center"
         >
            <AiOutlineClose className="absolute right-5 top-5 text-2xl cursor-pointer" onClick={onClose} />
            {children}
         </div>
      </div>,
      modalRoot
   )
}
