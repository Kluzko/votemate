declare global {
   namespace NodeJS {
      interface ProcessEnv {
         DATABASE_URL: string
         NODE_ENV: 'development' | 'production'
         PORT: string
         JWT_SECRET: string
         COOKIE_SECRET: string
         RESEND_SECRET_KEY: string
         PUBLIC_URL: string
      }
   }
}

export {}