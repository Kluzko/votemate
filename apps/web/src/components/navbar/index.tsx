import { Links } from './links'

export const Navbar = () => (
   <nav className="container mx-auto mt-4 px-4 flex items-end justify-between">
      <h1
         className="font-lalezar tracking-wider  text-4xl md:text-5xl cursor-pointer"
         onClick={() => window.navigate({ to: '/' })}
      >
         VOTEMATE
      </h1>
      <div className="flex ">
         {Links.map(({ text, link }, i) => (
            <p
               key={text}
               className={`font-lalezar text-xl md:text-2xl cursor-pointer hover:opacity-80 transition-all ${
                  i !== Links.length - 1 ? 'pr-3 md:pr-5' : ''
               }`}
               onClick={() => window.navigate({ to: link })}
            >
               {text}
            </p>
         ))}
      </div>
   </nav>
)
