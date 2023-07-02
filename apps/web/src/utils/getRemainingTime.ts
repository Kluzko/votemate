export const getRemainingTime = (endDate: Date): string => {
   if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date')
   }

   const timeDifference = endDate.getTime() - Date.now()

   if (timeDifference < 0) {
      return 'Expired'
   }

   const [millisecondsPerMinute, millisecondsPerHour, millisecondsPerDay] = [
      60 * 1000,
      60 * 60 * 1000,
      24 * 60 * 60 * 1000,
   ]

   const [days, hours, minutes] = [
      Math.floor(timeDifference / millisecondsPerDay),
      Math.floor((timeDifference % millisecondsPerDay) / millisecondsPerHour),
      Math.floor((timeDifference % millisecondsPerHour) / millisecondsPerMinute),
   ]

   return days > 0
      ? `${days} day${days > 1 ? 's' : ''}`
      : hours > 0
      ? `${hours} hour${hours > 1 ? 's' : ''}`
      : minutes > 0
      ? `${minutes} minute${minutes > 1 ? 's' : ''}`
      : 'Less than a minute'
}
