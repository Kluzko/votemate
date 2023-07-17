import { type ChangeEvent } from 'react'
import { type FieldError } from 'react-hook-form'

type SelectDropdownProps = {
   id: string
   className?: string
   options: {
      value: string
      label: string
   }[]
   onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
   register?: any
   error?: FieldError
}

export const Select = ({ id, className, options, onChange }: SelectDropdownProps) => {
   return (
      <div className={className ? className : 'w-44'}>
         <select
            id={id}
            name={id}
            className={` 
      border-solid border-4 border-darkGray py-3 px-2 w-full bg-electricPurple font-lalezar text-center text-lightGray shadow-basic cursor-pointer duration-200 focus:shadow-none
      ${className}`}
            onChange={onChange}
         >
            {options.map(option => (
               <option key={option.value} value={option.value}>
                  {option.label}
               </option>
            ))}
         </select>
      </div>
   )
}
