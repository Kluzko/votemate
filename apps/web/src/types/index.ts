type TailwindColors = 'darkGray' | 'graphite' | 'limeGreen' | 'electricPurple' | 'lightGray' | 'tomatoRed'

export type TailwindColorClass = `text-${TailwindColors}`
export type TailwindBackgroundClass = `bg-${TailwindColors}`

export type Pool = {
   id: string
   question: string
   expiresAt: string
   answers: string[]
   isPublic: boolean
}

export type PoolUpdate = {
   id: string
   question: string
   expiresAt: Date
   answers: string[]
   isPublic: boolean
}

export type PoolWithoutId = {
   question: string
   expiresAt: Date
   answers: string[]
   isPublic: boolean
}

export type Pools = {
   pools: Pool[]
}

export type Modals = 'createPoolModal' | 'updatePoolModal' | 'deletePoolModal'
