import { Button } from 'components/shared'

export const PageNotFound = () => (
   <div
      className="container mx-auto px-4 h-full flex flex-col items-center
   justify-center
   
   "
   >
      <h1 className="font-lalezar text-9xl md:text-[200px]">404</h1>
      <p className="font-lalezar text-2xl md:text-4xl text-electricPurple">
         Oops! It seems you&apos;ve taken a wrong turn.
      </p>
      {/* TODO:route here to join-pool when implmented */}
      <Button
         background="bg-electricPurple"
         color="text-lightGray"
         text="JOIN POOL"
         additionalClasses="mt-4"
         type="button"
         onClick={() => window.navigate({ to: '/' })}
      />
   </div>
)
