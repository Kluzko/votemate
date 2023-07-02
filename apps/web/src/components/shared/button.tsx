import { type TailwindBackgroundClass, type TailwindColorClass } from 'types'

type ButtonProps = {
   color: TailwindColorClass
   background: TailwindBackgroundClass
   text: string
   additionalClasses?: string
   type?: 'button' | 'submit'
   onClick?: () => void
   width?: string
}

export const Button = ({ color, background, text, type, onClick, additionalClasses, width }: ButtonProps) => {
   const buttonClasses = `border-solid border-4 border-darkGray py-3 ${
      width ? width : 'w-96'
   } ${color} ${background} font-lalezar text-center shadow-basic text-2xl cursor-pointer duration-200 active:shadow-none active:translate-x-1 active:translate-y-1`

   return (
      <button className={`${buttonClasses} ${additionalClasses}`} type={type} onClick={onClick}>
         {text}
      </button>
   )
}
