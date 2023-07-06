import { type TailwindBackgroundClass, type TailwindColorClass } from 'types'
import debounce from 'lodash.debounce'
import { useMemo } from 'react'

type ButtonProps = {
   color: TailwindColorClass
   background: TailwindBackgroundClass
   text: string
   additionalClasses?: string
   type?: 'button' | 'submit'
   onClick?: () => void
   width?: string
   isLoading?: boolean
}

export const Button = ({
   color,
   background,
   text,
   type,
   onClick,
   additionalClasses,
   width,
   isLoading,
}: ButtonProps) => {
   const debouncedIsLoading = useMemo(() => debounce(() => isLoading, 300), [isLoading])

   const buttonClasses = `border-solid border-4 border-darkGray py-3 ${
      width ? width : 'w-96'
   } ${color} ${background} font-lalezar text-center shadow-basic text-2xl cursor-pointer duration-200 active:shadow-none active:translate-x-1 active:translate-y-1`

   return (
      <button className={`${buttonClasses} ${additionalClasses}`} type={type} onClick={onClick}>
         {debouncedIsLoading() ? 'Loading ...' : text}
      </button>
   )
}
