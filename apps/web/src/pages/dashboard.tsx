import { type ChangeEvent, useState } from 'react'
import { Card } from 'components/card'
import { Button, Select } from 'components/shared'
import { filterPoolsOptions } from 'static'
import { type Pool } from 'types'
import { useGetUserPools } from 'hooks/pool'
import { filterSelectedPool, isDate5MinsBeforeExpiration } from 'utils'
import { toast } from 'react-hot-toast'
import { DeletePoolModal, CreatePoolModal, UpdatePoolModal } from 'components/modals'
import { Loading } from 'components/loading'
import { useModal } from '@redux/hooks'

export const Dashboard = () => {
   const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
   const [selectedOption, setSelectedOption] = useState('')

   const { openModal } = useModal()

   const handleDelete = (pool: Pool) => {
      setSelectedPool(pool)
      openModal('deletePoolModal')
   }

   const handleUpdate = (pool: Pool) => {
      setSelectedPool(pool)
      if (isDate5MinsBeforeExpiration(pool.expiresAt)) {
         toast.error('Unable to update pool.Pool expires in less than 5 minutes.')
      } else {
         openModal('updatePoolModal')
      }
   }

   const { isLoading, pools } = useGetUserPools()

   const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value
      setSelectedOption(selectedValue)
   }

   if (isLoading) {
      return <Loading text="Loading pools" />
   }

   const filderedPools = filterSelectedPool(selectedOption, pools)

   // Add types like filteredPools === "expired" then message for empty array
   // No expired pools found

   return (
      <div className="container mx-auto mt-20 px-4 h-full flex flex-col items-center">
         <div className="w-full flex justify-between">
            <Select id="pools" options={filterPoolsOptions} onChange={handleSelectChange} />
            <Button
               background="bg-limeGreen"
               color="text-darkGray"
               text="ADD POOL"
               width="w-40"
               additionalClasses="text-base"
               onClick={() => openModal('createPoolModal')}
            />
         </div>
         <div className="mt-20">
            {filderedPools.length > 0 ? (
               filderedPools.map(pool => (
                  <div key={pool.question}>
                     <Card
                        expiresAt={pool.expiresAt}
                        title={pool.question}
                        votesNumber={23}
                        additionalClasses="mt-5"
                        isDashboard
                        type={pool.isPublic}
                        onDelete={() => handleDelete(pool)}
                        onUpdate={() => handleUpdate(pool)}
                     />
                  </div>
               ))
            ) : selectedOption === '' ? (
               <p className="font-lalezar mt-20 text-4xl">Missing Pools? Click Add Pool to add one!</p>
            ) : (
               <p className="font-lalezar mt-20 text-4xl">
                  {' '}
                  No <span className="lowercase">{selectedOption}</span> pools found
               </p>
            )}
         </div>
         {selectedPool && <DeletePoolModal question={selectedPool.question} id={selectedPool.id} />}
         {selectedPool && <UpdatePoolModal {...selectedPool} />}
         <CreatePoolModal />
      </div>
   )
}
