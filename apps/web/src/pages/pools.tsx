import { Card } from 'components/card'
import { Loading } from 'components/loading'
import { useGetPublicPools } from 'hooks/pool/useGetPublicPools'

export const Pools = () => {
   const { isLoading, pools } = useGetPublicPools()

   if (isLoading) {
      return <Loading text="Loading pools" />
   }
   return (
      <div className="container mx-auto mt-20 px-4 h-full flex flex-col items-center">
         <h1 className="font-lalezar text-4xl lg:text-5xl text-center">Community Choice Corner</h1>
         <p className="text-lg lg:text-xl text-graphite text-center">
            Here, you&apos;ll find a collection of public polls curated by the vibrant Votemate community.
         </p>
         {pools && pools.length > 0 ? (
            pools.map(({ expiresAt, question }) => (
               <Card expiresAt={expiresAt} title={question} votesNumber={32} key={question} additionalClasses="mt-5" />
            ))
         ) : (
            <p className="font-lalezar mt-20 text-4xl">No public pools for now</p>
         )}
      </div>
   )
}
