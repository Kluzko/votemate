import { useState, useEffect } from 'react'
import { getRemainingTime } from 'utils'

type CountdownProps = {
   endDate: string
   additionalClasses?: string
}

export const Countdown = ({ endDate, additionalClasses }: CountdownProps) => {
   const [remainingTime, setRemainingTime] = useState(getRemainingTime(endDate))

   useEffect(() => {
      const intervalId = setInterval(() => {
         setRemainingTime(getRemainingTime(endDate))
      }, 1000)

      return () => {
         clearInterval(intervalId)
      }
   }, [endDate])

   if (remainingTime === 'Expired') {
      return <p className={`text-tomatoRed ${additionalClasses}`}>Expired</p>
   }

   return <p className={`text-electricPurple ${additionalClasses}`}>Expires in: {remainingTime}</p>
}
