export interface Vote {
   voterId: string
}

export interface Answer {
   value: string
   votes: Vote[]
}

export interface PoolData {
   id: string
   userId: string
   question: string
   expiresAt: Date
   isPublic: boolean
   password: string
   answers: Answer[]
}
