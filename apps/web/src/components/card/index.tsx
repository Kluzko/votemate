import { Footer } from './footer'
import { Header } from './header'
import { Title } from './title'

type CardProps = {
   title: string
   expiresAt: string
   votesNumber: number
   additionalClasses?: string
   isDashboard?: boolean
   type?: boolean
   onDelete?: () => void
   onUpdate?: () => void
   onClick: () => void
}

const MAX_TEXT_LENGTH = 65

export const Card = ({
   title,
   expiresAt,
   votesNumber,
   additionalClasses = '',
   isDashboard = false,
   type,
   onDelete,
   onUpdate,
   onClick,
}: CardProps) => {
   const shouldShowTooltip = title?.length > MAX_TEXT_LENGTH

   const cardClasses = `group border-solid border-4 border-darkGray py-1 w-full sm:w-96 shadow-basic cursor-pointer px-2 flex flex-col mt-5 hover:border-electricPurple hover:shadow-green relative`

   const typeClasses = `border-solid border-b-4 border-l-4 font-lalezar px-3 py-1 border-darkGray group-hover:border-electricPurple ${
      type ? 'bg-limeGreen' : 'bg-tomatoRed'
   } absolute right-0 top-0`

   return (
      <div className={cardClasses} onClick={onClick}>
         <Header isDashboard={isDashboard} expiresAt={expiresAt} type={type} typeClasses={typeClasses} />
         <Title title={title} shouldShowTooltip={shouldShowTooltip} additionalClasses={additionalClasses} />
         <Footer isDashboard={isDashboard} votesNumber={votesNumber} onDelete={onDelete} onUpdate={onUpdate} />
      </div>
   )
}
