import type React from 'react'
import { useEffect } from 'react'

export const useOutsideClick = (ref: React.RefObject<HTMLElement>, onClick: () => void) => {
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (ref.current && !ref.current.contains(event.target as Node)) {
            onClick()
         }
      }

      document.addEventListener('mousedown', handleClickOutside)

      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [ref, onClick])
}
