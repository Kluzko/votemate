import { Countdown } from 'components/countdown'

type HeaderProps = {
   isDashboard: boolean
   expiresAt: string
   type?: boolean
   typeClasses: string
}

export const Header = ({ isDashboard, expiresAt, type, typeClasses }: HeaderProps) => (
   <div className={isDashboard ? 'flex justify-between' : ''}>
      <Countdown endDate={expiresAt} additionalClasses="text-sm mb-2" />
      {isDashboard && <div className={typeClasses}>{type ? 'PUBLIC' : 'PRIVATE'}</div>}
   </div>
)
