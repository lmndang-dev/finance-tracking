import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM ?? "FinTrack <no-reply@fintrack.app>";
const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export async function sendVerificationEmail(to: string, token: string) {
  const link = `${appUrl}/api/auth/verify?token=${token}`;
  await resend.emails.send({
    from,
    to,
    subject: "Verify your FinTrack account",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#3B3B98">Welcome to FinTrack</h2>
        <p>Click the button below to verify your email address.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#3B3B98;color:#fff;border-radius:999px;text-decoration:none;font-weight:600">
          Verify Email
        </a>
        <p style="color:#4B6584;font-size:13px;margin-top:24px">
          This link expires in 24 hours. If you didn't create a FinTrack account, you can ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const link = `${appUrl}/reset-password?token=${token}`;
  await resend.emails.send({
    from,
    to,
    subject: "Reset your FinTrack password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#3B3B98">Reset your password</h2>
        <p>Click the button below to choose a new password.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#3B3B98;color:#fff;border-radius:999px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
        <p style="color:#4B6584;font-size:13px;margin-top:24px">
          This link expires in 1 hour. If you didn't request a password reset, you can ignore this email.
        </p>
      </div>
    `,
  });
}
