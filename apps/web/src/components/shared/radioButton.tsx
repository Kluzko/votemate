type RadioButtonProps = {
   id: string
   text: string
   value: string
   register: any
   votedAnswerId: string | null
}

export const RadioButton = ({ id, value, text, register, votedAnswerId }: RadioButtonProps) => (
   <div className="flex items-center">
      <input
         {...register(id)}
         type="radio"
         id={id}
         name={id}
         value={value}
         className="w-6 h-6  appearance-none  border-4
        border-darkGray checked:bg-electricPurple cursor-pointer"
         defaultChecked={votedAnswerId === value}
         defaultValue={votedAnswerId}
      />
      <label htmlFor={id} className="pl-4 font-extrabold text-2xl">
         {text}
      </label>
   </div>
)
