// lib/email.ts

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import nodemailer from "nodemailer"

const sesClient = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const transporter = nodemailer.createTransport({
  SES: { ses: sesClient, aws: { SendEmailCommand } },
} as unknown as Parameters<typeof nodemailer.createTransport>[0])

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: `"Classified Ads" <${process.env.AWS_SES_FROM_EMAIL}>`,
      to,
      subject,
      html,
    })
    console.log('✅ Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Email failed:', error)
    return { success: false, error }
  }
}

export async function sendModerationEmail({
  to,
  userName,
  adTitle,
  status,
  reason,
}: {
  to: string
  userName: string
  adTitle: string
  status: "approved" | "rejected"
  reason?: string
}) {
  const subject = status === "approved" 
    ? "✅ Your Ad Has Been Approved!" 
    : "⚠️ Your Ad Needs Revision"

  const html = `<!DOCTYPE html>
<html><head><style>
body { font-family: Arial, sans-serif; line-height: 1.6; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background: ${status === "approved" ? "#10B981" : "#EF4444"}; color: white; padding: 20px; text-align: center; }
.content { background: #f9fafb; padding: 20px; }
.footer { text-align: center; padding: 20px; color: #6b7280; }
.btn { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
.rejection-box { background: #fee; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; }
</style></head>
<body><div class="container">
<div class="header"><h1>${status === "approved" ? "Congratulations!" : "Action Required"}</h1></div>
<div class="content">
<p>Hello ${userName},</p>
<p>Your advertisement "<strong>${adTitle}</strong>" has been <strong>${status}</strong>.</p>
${status === "rejected" && reason ? `<div class="rejection-box"><strong>Reason for rejection:</strong><br>${reason}</div><p>Please update your ad and resubmit it.</p>` : '<p>Your ad is now live on our platform!</p>'}
<a href="${process.env.NEXTAUTH_URL}/dashboard/my-ads" class="btn">View Your Ads</a>
</div>
<div class="footer"><p>Classified Ads Team</p></div>
</div></body></html>`

  return sendEmail({ to, subject, html })
}