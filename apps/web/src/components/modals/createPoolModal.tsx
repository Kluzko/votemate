import { DateInput, Form, Input, Modal, SelectValidation } from 'components/shared'
import { poolOptions } from 'static'
import { useCreatePoolForm } from 'hooks/forms'

type CreatePoolModalProps = {
   onClose: () => void
}

export const CreatPoolModal = ({ onClose }: CreatePoolModalProps) => {
   const { createPool, errors, register, watch } = useCreatePoolForm()

   const inputQuestionValue = watch('question')
   const inputAnswersValue = watch('answers')

   return (
      <Modal onClose={onClose}>
         <h1 className="text-4xl font-lalezar pt-10">Create Pool</h1>
         <Form submitText="CREATE POOL" addtionalClasses="mt-10" onSubmit={createPool}>
            <Input
               containerWidth="w-full"
               text="Question"
               register={register}
               id="question"
               type="text"
               inputValue={inputQuestionValue}
               error={errors.question}
            />
            <Input
               containerWidth="w-full mt-6 "
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
               containerClasses="w-full mt-6 "
               register={register}
               error={errors.expiresAt}
            />
            <SelectValidation
               id="poolType"
               options={poolOptions}
               className="mt-4 w-full mb-5"
               error={errors.poolType}
               register={register}
            />
         </Form>
      </Modal>
   )
}
