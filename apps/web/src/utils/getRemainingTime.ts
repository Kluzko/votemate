const pluralize = (value: number, unit: string): string => `${value} ${unit}${value > 1 ? 's' : ''}`

export const getRemainingTime = (endDateStr: string) => {
   const timeDifference = new Date(endDateStr).getTime() - Date.now()

   if (timeDifference < 0) return 'Expired'

   const [seconds, minutes, hours, days, months] = [
      (timeDifference / 1000) % 60,
      (timeDifference / (60 * 1000)) % 60,
      (timeDifference / (60 * 60 * 1000)) % 24,
      (timeDifference / (24 * 60 * 60 * 1000)) % 30,
      timeDifference / (30 * 24 * 60 * 60 * 1000),
   ].map(Math.floor)

   if (months > 0) return pluralize(months, 'month')
   if (days > 0) return pluralize(days, 'day')
   if (hours > 0) return `${pluralize(hours, 'hour')} ${minutes > 14 ? '' : ` ${pluralize(minutes, 'minute')}`}`
   if (minutes > 0) return `${pluralize(minutes, 'minute')} ${minutes > 15 ? '' : ` ${pluralize(seconds, 'second')}`}`

   return pluralize(seconds, 'second')
}
