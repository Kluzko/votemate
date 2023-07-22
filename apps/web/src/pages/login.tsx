import { Form, Input } from 'components/shared'
import { useLoginForm } from 'hooks/forms'

export const Login = () => {
   const { login, isLoading, register, errors, watch } = useLoginForm()

   const inputValue = watch('email')

   return (
      <div className="container  mx-auto  px-4 flex flex-col items-center   justify-center h-full">
         <h1 className="font-lalezar text-3xl sm:text-4xl md:text-5xl">Log in with Magic Link</h1>
         <p className="text-center text-graphite text-sm md:text-base">
            Access your account by entering your email address below, and we&apos;ll send you a magic link.
         </p>
         <Form submitText="LOG IN" addtionalClasses="mt-20" onSubmit={login} isLoading={isLoading}>
            <Input
               id="email"
               type="email"
               text="Email adress"
               register={register}
               error={errors.email}
               inputValue={inputValue}
               containerWidth="w-80 sm:w-full"
            />
         </Form>
      </div>
   )
}
