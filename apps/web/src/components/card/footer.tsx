import { BsPencil, BsTrash } from 'react-icons/bs'

type FooterProps = {
   isDashboard: boolean
   votesNumber: number
   onDelete?: () => void
   onUpdate?: () => void
}

export const Footer = ({ isDashboard, votesNumber, onDelete, onUpdate }: FooterProps) => (
   <div className={isDashboard ? 'flex justify-between' : ''}>
      <p className="text-sm text-electricPurple mt-2">Number of votes: {votesNumber}</p>
      {isDashboard && (
         <div className="flex items-center">
            <BsTrash
               className="text-tomatoRed text-lg mr-2 hover:opacity-80"
               title="Delete Pool"
               onClick={event => {
                  event.stopPropagation()
                  onDelete?.()
               }}
            />
            <BsPencil
               className="text-electricPurple text-lg hover:text-graphite"
               title="Edit Pool"
               onClick={event => {
                  event.stopPropagation()
                  onUpdate?.()
               }}
            />
         </div>
      )}
   </div>
)
