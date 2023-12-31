import { useAuth } from '@redux/hooks'
import { useSearch } from '@tanstack/router'
import axios, { type AxiosError } from 'axios'
import { Loading } from 'components/loading'
import { Button } from 'components/shared'
import { useEffect, useState } from 'react'

//TODO: add change to react-query
export const Verify = () => {
   const { emailToken } = useSearch({ from: '/verify' })

   const [tokenError, setTokenError] = useState<number | undefined>()
   const { setIsAuthenticated } = useAuth()
   const checkToken = async () => {
      try {
         await axios.get(`/api/verify?emailToken=${emailToken}`)
         setTokenError(undefined)
         setTimeout(() => {
            window.navigate({ to: '/dashboard' })
         }, 2000)
         setIsAuthenticated(true)
      } catch (error) {
         const tokenError = (error as AxiosError)?.response?.status

         setTokenError(tokenError)
      }
   }

   useEffect(() => {
      if (!emailToken) {
         window.navigate({ to: '/' })
         return
      }
      checkToken()
   }, [emailToken])

   if (tokenError === 403) {
      return (
         <div className="container mx-auto  px-4 h-full mt-44 flex flex-col items-center ">
            <h1 className="text-2xl sm:text-4xl font-lalezar">Your Magic link has expired</h1>
            <p className="text-xs sm:text-base text-center pt-5 text-graphite">
               Note: The magic link <span className="text-electricPurple">expires in 10 minutes. </span> If it expires,
               you can request a new one on the login page.
            </p>
            <Button
               background="bg-electricPurple"
               color="text-lightGray"
               text="GO TO LOGIN"
               additionalClasses="mt-14"
               width="w-40 sm:w-56"
               type="button"
               size="text-base sm:text-lg"
               onClick={() => window.navigate({ to: '/login' })}
            />
         </div>
      )
   }

   if (tokenError === 401) {
      return (
         <div className="container mx-auto  px-4 h-full mt-44 flex flex-col items-center ">
            <h1 className="text-2xl sm:text-4xl font-lalezar">Invalid Magic link token</h1>
            <p className="text-xs sm:text-base text-center pt-5 text-graphite">
               The Magic link token you entered does not match the one we sent to you. Feel free to request a new token
               on the login page.
            </p>
            <Button
               background="bg-limeGreen"
               color="text-darkGray"
               text="GO TO LOGIN"
               additionalClasses="mt-14"
               width="w-40 sm:w-56"
               size="text-base sm:text-lg"
               type="button"
               onClick={() => window.navigate({ to: '/login' })}
            />
         </div>
      )
   }

   return (
      <div className="container mx-auto  px-4 h-full  flex flex-col items-center justify-center ">
         <Loading text="Verification successfull" />
         <p className="text-sm sm:text-lg text-center pt-4 text-graphite">
            Please wait while you are being redirected to the dashboard
         </p>
      </div>
   )
}
