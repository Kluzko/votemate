export const Loading = ({ text }: { text: string }) => (
   <div className="container mx-auto  px-4 h-full  flex flex-col items-center justify-center ">
      <div className="text-center flex space-x-2  items-center">
         <h1 className="text-5xl font-lalezar">{text}</h1>
         <div className="flex space-x-2 animate-pulse">
            <div className="w-3 h-3 bg-darkGray rounded-full"></div>
            <div className="w-3 h-3 bg-darkGray rounded-full"></div>
            <div className="w-3 h-3 bg-darkGray rounded-full"></div>
         </div>
      </div>
   </div>
)
