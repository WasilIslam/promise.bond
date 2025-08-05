import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  // Send email verification
  static async sendVerificationEmail(
    email: string,
    token: string
  ): Promise<void> {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

    const emailTemplate: EmailTemplate = {
      to: email,
      subject: "🎯 Verify your Promise.Bond account",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="background: linear-gradient(135deg, #ff6b9d 0%, #a78bfa 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Promise.Bond</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Welcome to the future of campus connections</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Almost there! 🚀</h2>
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 30px;">
              Click the button below to verify your email and start discovering amazing connections in your organization.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #ff6b9d 0%, #a78bfa 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 50px; font-weight: 600; font-size: 16px;
                        display: inline-block; transition: transform 0.2s;">
                Verify My Email ✨
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
              If the button doesn't work, copy and paste this link:<br>
              <span style="word-break: break-all; color: #6b7280;">${verificationUrl}</span>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              This link expires in 24 hours. If you didn't sign up for Promise.Bond, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await this.sendEmail(emailTemplate);
  }

  // Send match notification
  static async sendMatchNotification(
    userEmail: string,
    matchedUserName: string
  ): Promise<void> {
    const emailTemplate: EmailTemplate = {
      to: userEmail,
      subject: "🎉 You have a new match on Promise.Bond!",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="background: linear-gradient(135deg, #ff6b9d 0%, #a78bfa 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🎉 IT'S A MATCH!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Something exciting just happened</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 60px; margin-bottom: 20px;">💕</div>
              <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px;">Congratulations!</h2>
              <p style="color: #6b7280; line-height: 1.6; font-size: 18px;">
                <strong>${matchedUserName}</strong> has chosen you as their crush too!
              </p>
            </div>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #ff6b9d; margin: 25px 0;">
              <p style="color: #374151; margin: 0; font-size: 16px; line-height: 1.5;">
                🌟 This means you both selected each other! Time to take the next step and say hello.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL}/matches" 
                 style="background: linear-gradient(135deg, #ff6b9d 0%, #a78bfa 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 50px; font-weight: 600; font-size: 16px;
                        display: inline-block;">
                View Your Matches 🔥
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Keep it cool, keep it fun! 😎<br>
              Promise.Bond Team
            </p>
          </div>
        </div>
      `,
    };

    await this.sendEmail(emailTemplate);
  }

  // Send generic email
  private static async sendEmail(template: EmailTemplate): Promise<void> {
    try {
      await transporter.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
        to: template.to,
        subject: template.subject,
        html: template.html,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Email sending failed");
    }
  }
}
