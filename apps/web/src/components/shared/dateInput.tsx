import { useState } from 'react'

import { type FieldError } from 'react-hook-form'

type DateInputProps = {
   text: string
   id: string
   register: any
   error?: FieldError
   containerClasses?: string
}

export const DateInput = ({ text, id, error, register, containerClasses }: DateInputProps) => {
   const [today] = useState(() => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')

      return `${year}-${month}-${day}T${hours}:${minutes}`
   })
   const getLabelClass = () => {
      if (error) {
         return '-top-5 left-0 text-tomatoRed'
      } else {
         return 'left-3 top-4'
      }
   }

   return (
      <div className={`flex flex-col relative ${containerClasses ? containerClasses : 'w-96'}`}>
         <label
            htmlFor={id}
            className={`font-lalezar text-lightGray
         absolute duration-200 ${getLabelClass()}`}
         >
            {error ? error.message : text}
         </label>
         <input
            id={id}
            name={id}
            {...register(id)}
            type="datetime-local"
            min={today}
            className="border-solid border-4 border-darkGray py-3 px-2
            bg-tomatoRed font-lalezar text-center text-lightGray
            shadow-basic cursor-pointer duration-200 focus:shadow-none w-full"
         />
      </div>
   )
}
