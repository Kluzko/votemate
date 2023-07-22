import { DateInput, Form, Input, Modal, SelectValidation } from 'components/shared'
import { poolOptions } from 'static'
import { useCreatePoolForm } from 'hooks/forms'

export const CreatePoolModal = () => {
   const { createPool, isLoading, errors, register, watch } = useCreatePoolForm()

   const inputQuestionValue = watch('question')
   const inputAnswersValue = watch('answers')

   return (
      <Modal modal="createPoolModal">
         <h1 className="text-3xl text-center sm:text-4xl font-lalezar pt-10">Create Pool</h1>
         <Form submitText="CREATE POOL" addtionalClasses="mt-10" onSubmit={createPool} isLoading={isLoading}>
            <Input
               containerWidth="w-80 sm:w-full"
               text="Question"
               register={register}
               id="question"
               type="text"
               inputValue={inputQuestionValue}
               error={errors.question}
            />
            <Input
               containerWidth="w-80 sm:w-full mt-6 "
               text="Answers (each answer separte with comma)"
               register={register}
               id="answers"
               type="text"
               inputValue={inputAnswersValue}
               error={errors.answers}
            />
            <DateInput
               id="expiresAt"
               text="Expires At :"
               containerClasses="w-80 sm:w-full mt-6 "
               register={register}
               error={errors.expiresAt}
            />
            <SelectValidation
               id="isPublic"
               options={poolOptions}
               className=" mt-4 w-80 sm:w-full mb-5"
               error={errors.isPublic}
               register={register}
            />
         </Form>
      </Modal>
   )
}
