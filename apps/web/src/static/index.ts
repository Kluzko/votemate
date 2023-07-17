export const examplePools = [
   {
      title: 'Best Pizza Topping',
      expiresAt: new Date('2023-07-01'),
      votesNumber: 120,
      type: 'PUBLIC',
   },
   {
      title: 'Favorite Vacation Destination',
      expiresAt: new Date('2023-07-03'),
      votesNumber: 85,
      type: 'PRIVATE',
   },
   {
      title: 'Most Anticipated Movie of the Year',
      expiresAt: new Date('2023-07-05'),
      votesNumber: 42,
      type: 'PUBLIC',
   },
   {
      title: 'Top Mobile Apps for Productivity',
      expiresAt: new Date('2023-07-07'),
      votesNumber: 68,
      type: 'PRIVATE',
   },
   {
      title: 'Greatest Rock Bands of All Time',
      expiresAt: new Date('2023-07-09'),
      votesNumber: 93,
      type: 'PUBLIC',
   },
   {
      title: 'Preferred Social Media Platform',
      expiresAt: new Date('2023-07-09'),
      votesNumber: 23,
      type: 'PRIVATE',
   },
] as const

export const poolOptions = [
   {
      value: '',
      label: 'CHOOSE POOL TYPE',
   },
   {
      value: 'PRIVATE',
      label: 'PRIVATE POOL',
   },
   {
      value: 'PUBLIC',
      label: 'PUBLIC POOL',
   },
]

export const filterPoolsOptions = [
   {
      value: '',
      label: 'All POOLS',
   },
   {
      value: 'PRIVATE',
      label: 'PRIVATE POOLS',
   },
   {
      value: 'PUBLIC',
      label: 'PUBLIC POOLS',
   },
   {
      value: 'EXPIRED',
      label: 'EXPIRED POOLS',
   },
   {
      value: 'ACTIVE',
      label: 'ACTIVE POOLS',
   },
]
