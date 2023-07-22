import { DateInput, Form, Input, Modal, SelectValidation } from 'components/shared'
import { poolOptions } from 'static'
import { useUpdatePoolForm } from 'hooks/forms'
import { type Pool } from 'types'
import { useEffect } from 'react'

type UpdatePoolModalProps = Pool

export const UpdatePoolModal = ({ question, isPublic, expiresAt, answers, id }: UpdatePoolModalProps) => {
   const { updatePool, isLoading, errors, register, watch, setValue } = useUpdatePoolForm({ id })

   const formattedDate = expiresAt.substring(0, 16).replace('T', 'T')
   const joinedAnswers = answers.map(({ value }) => value).join(',')
   const isPublicToEnum = isPublic ? 'PUBLIC' : 'PRIVATE'

   useEffect(() => {
      setValue('question', question)
      setValue('expiresAt', formattedDate)
      setValue('answers', joinedAnswers)
      setValue('isPublic', isPublicToEnum)
   }, [id])

   const inputQuestionValue = watch('question')
   const inputAnswersValue = watch('answers')

   return (
      <Modal modal="updatePoolModal">
         <h1 className="text-3xl text-center sm:text-4xl font-lalezar pt-10">Update Pool</h1>
         <Form submitText="UPDATE POOL" addtionalClasses="mt-10" onSubmit={updatePool} isLoading={isLoading}>
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
               className="mt-4 w-80 sm:w-full mb-5"
               error={errors.isPublic}
               register={register}
            />
         </Form>
      </Modal>
   )
}
