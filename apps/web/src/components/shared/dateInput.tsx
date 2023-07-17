import { useState } from 'react'
import { type FieldError } from 'react-hook-form'

type DateInputProps = {
   text: string
   id: string
   register: any
   error?: FieldError
   containerClasses?: string
}

export const DateInput = ({ text, id, register, error, containerClasses }: DateInputProps) => {
   const [today] = useState(() => {
      const now = new Date()
      return now.toISOString().substring(0, 16)
   })

   const max = (() => {
      const date = new Date()
      date.setFullYear(date.getFullYear() + 1)
      return date.toISOString().substring(0, 16)
   })()

   const getLabelClass = () => (error ? '-top-5 left-0 text-tomatoRed' : 'left-3 top-4')

   return (
      <div className={`flex flex-col relative ${containerClasses ?? 'w-96'}`}>
         <label htmlFor={id} className={`font-lalezar text-lightGray absolute duration-200 ${getLabelClass()}`}>
            {error ? error?.message : text}
         </label>
         <input
            id={id}
            name={id}
            {...register(id)}
            type="datetime-local"
            min={today}
            max={max}
            className="border-solid border-4 border-darkGray py-3 px-2 bg-tomatoRed font-lalezar text-center text-lightGray shadow-basic cursor-pointer duration-200 focus:shadow-none w-full"
         />
      </div>
   )
}
