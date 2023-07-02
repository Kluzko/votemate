import { Resend } from 'resend';

type EmailContent =  {
  from: string;
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private resend: Resend;

  constructor(resendSecretKey: string) {
    this.resend = new Resend(resendSecretKey);
  }

  private getAuthUrl(authToken: string): string {
    return process.env.NODE_ENV === 'production'
      ? `${process.env.PUBLIC_URL}/verify/${authToken}`
      : `http://localhost:3000/verify/${authToken}`;
  }

  private generateHtmlContent(email: string, authToken: string): string {
    return `
      <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
        <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px;">
          <h2 style="color: #333333; text-align: center;">Hello, ${email}</h2>
          <p style="color: #333333; margin-bottom: 20px;">We're excited to have you on board with Votamate, the pooling app!</p>
          <p style="color: #333333;">To securely access your account, please click the magic link below:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${this.getAuthUrl(authToken)}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px;">Click here to log in</a>
          </p>
          <p style="color: #333333; margin-bottom: 20px;">If you didn't request this email, please ignore it. Your account is safe and no action is required.</p>
          <p style="color: #333333;">Happy pooling!</p>
          <p style="color: #333333; text-align: center; margin-top: 40px;">The Votamate Team</p>
        </div>
      </div>
    `;
  }

  async sendMagicLink(email: string, authToken: string) {
    try {
      const htmlContent = this.generateHtmlContent(email, authToken);

      const emailContent: EmailContent = {
        from: 'Votamate <onboarding@resend.dev>',
        to: email,
        subject: 'Your Magic Link for Votamate',
        html: htmlContent,
      };

      await this.resend.emails.send(emailContent);
    } catch (error:any) {
      throw new Error(error);
    }
  }
}

export const emailService = new EmailService(process.env.RESEND_SECRET_KEY);