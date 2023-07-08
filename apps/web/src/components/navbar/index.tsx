import { useLogout } from 'hooks/user'
import { Links } from './links'
import { useAuth } from '@redux/hooks'

export const Navbar = () => {
   const { isAuthenticated } = useAuth()

   const { logout } = useLogout()

   const LinkClass = 'font-lalezar text-xl md:text-2xl cursor-pointer hover:opacity-80 transition-all '

   return (
      <nav className="container mx-auto mt-4 px-4 flex items-end justify-between">
         <h1
            className="font-lalezar tracking-wider  text-4xl md:text-5xl cursor-pointer"
            onClick={() => window.navigate({ to: '/' })}
         >
            VOTEMATE
         </h1>
         <div className="flex ">
            {Links.map(({ text, link }) => (
               <p key={text} className={`${LinkClass} pr-3 md:pr-5`} onClick={() => window.navigate({ to: link })}>
                  {text}
               </p>
            ))}
            {isAuthenticated ? (
               <>
                  <p className={`${LinkClass} pr-3 md:pr-5`} onClick={() => window.navigate({ to: '/dashboard' })}>
                     Dashboard
                  </p>
                  <p className={LinkClass} onClick={() => logout()}>
                     Log out
                  </p>
               </>
            ) : (
               <p className={LinkClass} onClick={() => window.navigate({ to: '/login' })}>
                  Log in
               </p>
            )}
         </div>
      </nav>
   )
}
