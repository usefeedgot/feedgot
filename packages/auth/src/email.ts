import { renderWelcomeEmail } from "./email/welcomeemail"
import { renderVerifyEmail, VerifyType } from "./email/verifyemail"
import type { Brand } from "./email/brandemail"
import { sendEmail } from "./email/transport"

export async function sendWelcome(to: string, name?: string, brand?: Brand) {
  const { html, text } = await renderWelcomeEmail(name, brand)
  await sendEmail({ to, subject: "Welcome to Feedgot", html, text })
}

export async function sendVerificationOtpEmail(to: string, otp: string, type: VerifyType, brand?: Brand) {
  const subject = type === "email-verification" ? "Verify your Feedgot email" : type === "forget-password" ? "Reset your Feedgot password" : "Your Feedgot sign-in code"
  const { html, text } = await renderVerifyEmail(otp, type, brand)
  await sendEmail({ to, subject, html, text })
}

export async function sendWorkspaceInvite(to: string, workspaceName: string, inviteUrl: string) {
  const subject = `Join ${workspaceName} on Feedgot`
  const html = `<div style="font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
    <h1 style="font-size:20px;margin:0 0 12px">Invite to ${workspaceName}</h1>
    <p style="font-size:14px;line-height:1.6;margin:0 0 16px">You have been invited to join the workspace <strong>${workspaceName}</strong>.</p>
    <p style="font-size:14px;line-height:1.6;margin:0 0 16px">Click the button below to accept your invite.</p>
    <p style="margin:20px 0"><a href="${inviteUrl}" style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;font-size:14px">Accept Invite</a></p>
    <p style="font-size:12px;color:#666">If the button doesn’t work, copy and paste this link in your browser:<br /><span>${inviteUrl}</span></p>
  </div>`
  const text = `You have been invited to join ${workspaceName}.
Accept invite: ${inviteUrl}`
  await sendEmail({ to, subject, html, text })
}
