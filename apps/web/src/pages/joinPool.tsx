import { Form, Input } from 'components/shared'
import { useJoinPoolForm } from 'hooks/forms'

export const JoinPool = () => {
   const { joinPool, isLoading, register, errors, watch } = useJoinPoolForm()
   const inputValue = watch('poolId')

   return (
      <div className="container  mx-auto  px-4 flex flex-col items-center  h-full justify-center">
         <h1 className="font-lalezar text-5xl">Join a Pool</h1>
         <p className="text-center text-graphite">Take Part: Enter Pool Id to Join</p>
         <Form submitText="JOIN POOL" addtionalClasses="mt-20" isLoading={isLoading} onSubmit={joinPool}>
            <Input
               id="poolId"
               type="text"
               text="Pool Id"
               register={register}
               error={errors.poolId}
               inputValue={inputValue}
            />
         </Form>
      </div>
   )
}
