import { Button } from 'components/shared'

export const Home = () => (
   <div className="container mt-24 mx-auto px-4 flex justify-between ">
      <div className="flex flex-col items-start justify-center md:max-w-sm lg:max-w-xl xl:max-w-3xl">
         <h1 className="font-extrabold text-4xl xl:text-5xl ">Collaborative Decision-Making Made Easy with Polling</h1>
         <p className="text-graphite text-lg mt-2">
            The ultimate pooling app that unleashes the collective wisdom of your team, friends, or community.
            Effortlessly create and join polls, tap into the power of collaboration, and make decisions together like
            never before.
         </p>
         <Button
            background="bg-limeGreen"
            color="text-darkGray"
            text="GET STARTED"
            additionalClasses="mt-16 md:mt-4 xl:mt-20"
            type="button"
            onClick={() => window.navigate({ to: '/login' })}
         />
         <Button
            background="bg-electricPurple"
            color="text-lightGray"
            text="JOIN POOL"
            additionalClasses="mt-4"
            type="button"
            onClick={() => window.navigate({ to: '/' })}
         />
      </div>
      <div className="hidden md:flex justify-end ">
         <img
            src="/images/hands.png"
            alt="hero image"
            className="md:w-3/4 md:h-5/6  lg:w-full lg:h-full rounded-full shadow-basic"
         />
      </div>
   </div>
)
