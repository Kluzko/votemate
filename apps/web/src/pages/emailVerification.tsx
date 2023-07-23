export const EmailVerification = () => {
   return (
      <div className="container mx-auto  px-4 h-full  flex flex-col justify-center items-center ">
         <h1 className="text-2xl sm:text-5xl font-lalezar">Email Verification Required</h1>
         <p className="pt-12 text-sm sm:text-lg">
            Please check your email inbox (including spam folder) and click the magic link we sent you to verify your
            account.
         </p>
         <p className="pt-8 text-graphite text-sm sm:text-lg">
            Note: The magic link <span className="text-electricPurple font-bold">expires in 10 minutes. </span> If it
            expires, you can request a new one on the login page.
         </p>
      </div>
   )
}
