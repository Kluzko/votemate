import { z } from 'zod'

export const UserSchema = z.object({
   id: z.string(),
   email: z.string().email(),
})

export type UserData = z.infer<typeof UserSchema>

export const EmailSchema = z.object({ email: z.string().email() })

export const tokenSchema = z.object({ email: z.string().email() })

export type UserEmail = z.infer<typeof EmailSchema>

export const VerifySchema = z.object({ emailToken: z.string() })

export type VerifyData = z.infer<typeof VerifySchema>

export const AuthSchema = z.object({ authToken: z.string().optional() })

export type AuthData = z.infer<typeof AuthSchema>

export type EmailContent = {
   from: string
   to: string
   subject: string
   html: string
}

export const loginUserSchema = z.object({ email: z.string().email() })
