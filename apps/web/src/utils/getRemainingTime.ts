export const getRemainingTime = (endDateStr: string) => {
   const timeDifference = new Date(endDateStr).getTime() - Date.now()

   if (timeDifference < 0) return 'Expired'

   const [minutes, hours, days, months] = [
      (timeDifference / (60 * 1000)) % 60,
      (timeDifference / (60 * 60 * 1000)) % 24,
      (timeDifference / (24 * 60 * 60 * 1000)) % 30,
      timeDifference / (30 * 24 * 60 * 60 * 1000),
   ].map(Math.floor)

   if (months > 0) return `${months} month${months > 1 ? 's' : ''}`
   if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
   if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
   if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`

   return 'Less than a minute'
}
