import { useParams } from '@tanstack/router'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Bar } from 'react-chartjs-2'

import { Countdown } from 'components/countdown'
import { Loading } from 'components/loading'
import { Button, Form, RadioButton } from 'components/shared'
import { useVotePoolForm } from 'hooks/forms'
import { useGetPoolById } from 'hooks/pool'
import { useOnVoteUpdate } from 'hooks/vote'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title)

export const Pool = () => {
   const { id } = useParams()
   const { isLoading, pool } = useGetPoolById({ id })
   const { register, votePool, errors, isLoading: isVotingCastLoading } = useVotePoolForm({ poolId: id })

   useOnVoteUpdate({ poolId: id })

   if (isLoading) {
      return <Loading text="Loading pool" />
   }

   if (!pool) {
      return (
         <div className="container mx-auto  px-4 h-full  flex flex-col items-center justify-center ">
            <div className="text-center flex flex-col space-x-2  items-center">
               <h1 className="text-5xl font-lalezar mb-10">Pool not found</h1>
               <Button
                  background="bg-limeGreen"
                  text="Go back to pools"
                  color="text-darkGray"
                  onClick={() => window.navigate({ to: '/pools' })}
               />
            </div>
         </div>
      )
   }

   if (!pool.isPublic) {
      return (
         <div className="container mx-auto  px-4 h-full  flex flex-col items-center justify-center ">
            <div className="text-center flex flex-col space-x-2  items-center">
               <h1 className="text-5xl font-lalezar mb-10">Voting for Private Pools is still in development</h1>
            </div>
         </div>
      )
   }

   const { answers, votedAnswerId } = pool

   const poolExpired = new Date(pool.expiresAt).getTime() - Date.now() < 0

   const votesData = pool.answers.map(answer => pool.voteCounts[answer.value])

   const data = {
      labels: pool.answers.map(answer => answer.value),
      datasets: [
         {
            label: '# of Votes',
            data: votesData,
            backgroundColor: [
               'rgba(255, 99, 132, 0.2)', // red
               'rgba(75, 192, 192, 0.2)', // green
               'rgba(255, 159, 64, 0.2)', // orange
               'rgba(153, 102, 255, 0.2)', // purple
               'rgba(255, 206, 86, 0.2)', // yellow
            ],
            borderColor: [
               'rgba(255, 99, 132, 1)', // red
               'rgba(75, 192, 192, 1)', // green
               'rgba(255, 159, 64, 1)', // orange
               'rgba(153, 102, 255, 1)', // purple
               'rgba(255, 206, 86, 1)', // yellow
            ],
            borderWidth: 2,
         },
      ],
   }

   return (
      <div
         className={`container mt-24 mx-auto px-4 flex flex-col items-center justify-center ${
            poolExpired ? '' : 'lg:flex-row lg:justify-between'
         }   `}
      >
         <div className={`flex flex-col items-center ${poolExpired ? '' : 'lg:items-start'} w-full`}>
            {poolExpired && (
               <h1 className="font-lalezar text-tomatoRed text-xl mb-4">
                  The pool has expired. You can now only view the statistics.
               </h1>
            )}
            <h1 className="font-lalezar text-5xl">{pool.question}</h1>

            {!poolExpired && (
               <>
                  <Countdown endDate={pool.expiresAt} additionalClasses="font-bold mb-8" />
                  <Form submitText="Vote" isLoading={isVotingCastLoading} onSubmit={votePool}>
                     <div className="flex flex-col ">
                        {errors.answerId && <p className="text-tomatoRed pb-2">{errors.answerId.message}</p>}
                        {answers.map(({ value, id }) => (
                           <RadioButton
                              key={value}
                              id="answerId"
                              value={id}
                              text={value}
                              register={register}
                              votedAnswerId={votedAnswerId}
                           />
                        ))}
                     </div>
                  </Form>
               </>
            )}
         </div>
         <div className="w-full h-full py-8 lg:px-4 items-center lg:items-end max-w-3xl">
            <Bar
               data={data}
               className="w-full"
               options={{
                  resizeDelay: 50,
                  responsive: true,
                  plugins: {
                     title: {
                        display: true,
                        text: 'Votes Statistics',
                        font: { size: 20 },
                     },
                  },
               }}
            />
         </div>
      </div>
   )
}
