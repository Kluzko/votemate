export const isDate5MinsBeforeExpiration = (expirationTimeString: string): boolean => {
   const expirationTime = new Date(expirationTimeString)
   const futureTime = new Date()
   futureTime.setMinutes(futureTime.getMinutes() + 5)

   return futureTime >= expirationTime
}
