import { type Pool } from 'types'

export const filterSelectedPool = (selectedValue: string, pools: Pool[] | undefined) => {
   const filteredPools = pools ?? []
   const currentDate = new Date()

   return filteredPools.filter(pool => {
      const expiresAt = new Date(pool.expiresAt)

      return (
         selectedValue === '' ||
         (selectedValue === 'PRIVATE' && !pool.isPublic) ||
         (selectedValue === 'PUBLIC' && pool.isPublic) ||
         (selectedValue === 'EXPIRED' && expiresAt < currentDate) ||
         (selectedValue === 'ACTIVE' && expiresAt >= currentDate)
      )
   })
}
