import { useState } from 'react'
import { type FieldError } from 'react-hook-form'

type InputProps = {
   text: string
   id: string
   type: 'text' | 'email'
   register: any
   error?: FieldError
   inputValue: string
   containerWidth?: string
}

export const Input = ({ text, id, type, error, register, inputValue, containerWidth }: InputProps) => {
   const [isFocused, setIsFocused] = useState(false)
   const getLabelClass = () => {
      if (error) {
         return '-top-5 sm:left-0 text-tomatoRed'
      } else if (isFocused || inputValue?.length > 1) {
         return '-top-5 sm:left-0'
      } else {
         return 'left-3 top-2'
      }
   }

   return (
      <div className={`flex flex-col relative ${containerWidth ? containerWidth : 'w-96'}`}>
         <label htmlFor={id} className={`font-lalezar text-sm sm:text-base absolute duration-200 ${getLabelClass()}`}>
            {error ? error.message : text}
         </label>
         <input
            {...register(id)}
            id={id}
            name={id}
            className="border-solid border-4 border-darkGray py-3 px-4 font-bold w-full shadow-basic  cursor-pointer duration-200 focus:shadow-none focus:border-electricPurple"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            type={type}
            autoComplete="off"
         />
      </div>
   )
}
