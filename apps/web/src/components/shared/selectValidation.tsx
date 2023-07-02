import { type FieldError } from 'react-hook-form'

type SelectDropdownProps = {
   id: string
   className?: string
   options: {
      value: string | number
      label: string
   }[]
   register: any
   error?: FieldError
}

export const SelectValidation = ({ id, className, options, register, error }: SelectDropdownProps) => {
   return (
      <div className={`flex flex-col relative ${className ? className : 'w-44'}`}>
         {error?.message ? (
            <label
               htmlFor={id}
               className={`font-lalezar text-tomatoRed
         absolute -top-1 left-0
         `}
            >
               {error.message}
            </label>
         ) : null}
         <select
            id={id}
            name={id}
            {...register(id)}
            className={` 
      border-solid border-4 border-darkGray py-3 px-2 w-full bg-electricPurple font-lalezar text-center text-lightGray shadow-basic cursor-pointer duration-200 focus:shadow-none
      ${className}`}
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
