declare global {
   namespace NodeJS {
      interface ProcessEnv {
         DATABASE_URL: string
         NODE_ENV: 'development' | 'production' | 'test'
         PORT: string
         JWT_SECRET: string
         COOKIE_SECRET: string
         RESEND_SECRET_KEY: string
         PUBLIC_URL: string
         EMAIL_FROM: string
      }
   }
}

export {}
