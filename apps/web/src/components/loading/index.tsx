export const Loading = ({ text, withFullHeight }: { text: string; withFullHeight?: boolean }) => (
   <div
      className={`mx-auto container ${
         withFullHeight ? 'h-full' : null
      } px-4 flex flex-col items-center justify-center `}
   >
      <div className="text-center flex  space-x-2  items-center">
         <h1 className="text-2xl sm:text-5xl font-lalezar">{text}</h1>
         <div className="flex space-x-2 animate-pulse">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-darkGray rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-darkGray rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-darkGray rounded-full"></div>
         </div>
      </div>
   </div>
)
