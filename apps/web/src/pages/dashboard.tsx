import { useState } from 'react'
import { Card } from 'components/card'
import { CreatPoolModal } from 'components/modals/createPoolModal'
import { DeletePoolModal } from 'components/modals/deletePoolModal'
import { Button, Select } from 'components/shared'
import { poolOptions, examplePools } from 'static'

export const Dashboard = () => {
   const [isCreatPoolModalOpen, setCreatPoolModalOpen] = useState(false)
   const [isDeletePoolModalOpen, setDeletePoolModalOpen] = useState(false)
   const [selectedPool, setSelectedPool] = useState(null)
   // and pool schema type here someday xd
   const handleDelete = pool => {
      setSelectedPool(pool)
      setDeletePoolModalOpen(true)
   }
   return (
      <div className="container mx-auto mt-20 px-4 h-full flex flex-col items-center">
         <div className="w-full flex justify-between">
            <Select id="pools" options={poolOptions} />
            <Button
               background="bg-limeGreen"
               color="text-darkGray"
               text="ADD POOL"
               width="w-40"
               additionalClasses="text-base"
               onClick={() => setCreatPoolModalOpen(true)}
            />
         </div>
         <div className="mt-20">
            {examplePools.map(pool => (
               <div key={pool.title}>
                  <Card
                     expiresAt={pool.expiresAt}
                     title={pool.title}
                     votesNumber={pool.votesNumber}
                     additionalClasses="mt-5"
                     isDashboard
                     type={pool.type}
                     onDelete={() => handleDelete(pool)}
                  />
               </div>
            ))}
         </div>
         {isDeletePoolModalOpen && selectedPool ? (
            <DeletePoolModal title={selectedPool.title} onClose={() => setDeletePoolModalOpen(false)} />
         ) : null}
         {isCreatPoolModalOpen ? <CreatPoolModal onClose={() => setCreatPoolModalOpen(false)} /> : null}
      </div>
   )
}
