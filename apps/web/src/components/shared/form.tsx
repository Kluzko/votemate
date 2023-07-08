import { type ReactNode } from 'react'
import { Button } from './button'

type FormProps = {
   children: ReactNode
   submitText: string
   onSubmit?: (event: React.FormEvent) => void
   addtionalClasses?: string
   isLoading: boolean
}

export const Form = ({ children, submitText, onSubmit, addtionalClasses, isLoading }: FormProps) => (
   <form onSubmit={onSubmit} className={addtionalClasses} noValidate>
      {children}
      <Button
         background="bg-electricPurple"
         color="text-lightGray"
         text={submitText}
         additionalClasses="mt-4"
         type="submit"
         isLoading={isLoading}
      />
   </form>
)
