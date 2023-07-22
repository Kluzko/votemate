import { useEffect, useState } from 'react'
import { type TailwindBackgroundClass, type TailwindColorClass } from 'types'

type ButtonProps = {
   color: TailwindColorClass
   background: TailwindBackgroundClass
   text: string
   additionalClasses?: string
   type?: 'button' | 'submit'
   onClick?: () => void
   width?: string
   size?: string
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
   size,
}: ButtonProps) => {
   const [showLoading, setShowLoading] = useState(false)

   useEffect(() => {
      let timer: NodeJS.Timeout
      if (isLoading) {
         timer = setTimeout(() => setShowLoading(true), 300)
      } else {
         setShowLoading(false)
      }
      return () => clearTimeout(timer)
   }, [isLoading])

   const buttonClasses = `border-solid border-4 border-darkGray py-3 ${
      width ? width : 'w-full sm:w-96'
   } ${color} ${background} ${
      size ? size : 'text-xl sm:text-2xl'
   }  font-lalezar text-center shadow-basic  cursor-pointer duration-200 active:shadow-none active:translate-x-1 active:translate-y-1`

   return (
      <button className={`${buttonClasses} ${additionalClasses}`} type={type} onClick={onClick}>
         {showLoading ? 'Loading ...' : text}
      </button>
   )
}
