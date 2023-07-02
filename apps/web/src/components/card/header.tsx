import { getRemainingTime } from 'utils'

type HeaderProps = {
   isDashboard: boolean
   expiresAt: Date
   type?: 'PUBLIC' | 'PRIVATE'
   typeClasses: string
}

export const Header = ({ isDashboard, expiresAt, type, typeClasses }: HeaderProps) => (
   <div className={isDashboard ? 'flex justify-between' : ''}>
      <p className="text-sm text-electricPurple mb-2">Expires in: {getRemainingTime(expiresAt)}</p>
      {isDashboard && <div className={typeClasses}>{type}</div>}
   </div>
)
