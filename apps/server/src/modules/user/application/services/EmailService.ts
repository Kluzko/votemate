import { injectable } from 'inversify'
import { Resend } from 'resend'

import { SmtpError } from 'common/errors'

import { type EmailContent } from 'modules/user/api/schemas'

@injectable()
export class EmailService {
   private readonly resend: Resend

   constructor() {
      this.resend = new Resend(process.env.RESEND_SECRET_KEY)
   }

   private getAuthUrl(emailToken: string): string {
      const baseUrl = process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : 'http://localhost:3000'
      return `${baseUrl}/verify?emailToken=${emailToken}`
   }

   private generateHtmlContent(email: string, emailToken: string): string {
      return `
      <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
        <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px;">
          <h2 style="color: #333333; text-align: center;">Hello, ${email}</h2>
          <p style="color: #333333; margin-bottom: 20px;">We're excited to have you on board with Votemate, the pooling app!</p>
          <p style="color: #333333;">To securely access your account, please click the magic link below:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${this.getAuthUrl(
               emailToken
            )}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px;">Click here to log in</a>
          </p>
          <p style="color: #333333; margin-bottom: 20px;">If you didn't request this email, please ignore it. Your account is safe and no action is required.</p>
          <p style="color: #333333;">Happy pooling!</p>
          <p style="color: #333333; text-align: center; margin-top: 40px;">The Votemate Team</p>
        </div>
      </div>
    `
   }

   async sendMagicLink(email: string, emailToken: string) {
      // To avoid sending email on test and losing free mails
      // If in a test environment, just log the operation and return
      if (process.env.NODE_ENV === 'test') {
         console.log(`Email to ${email} with token ${emailToken} would be sent in a non-test environment.`)
         return
      }

      try {
         const htmlContent = this.generateHtmlContent(email, emailToken)

         const emailContent: EmailContent = {
            from: `Votemate <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Your Magic Link for Votemate',
            html: htmlContent,
         }

         await this.resend.emails.send(emailContent)
      } catch (error) {
         console.log(error)
         throw new SmtpError()
      }
   }
}
