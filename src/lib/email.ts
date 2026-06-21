import { Resend } from "resend";

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

export async function sendVerificationCode(email: string, code: string) {
  const resend = getResend();
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Your Pickleball Verification Code",
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Verify Your Email</h2>
        <p style="font-size: 15px; color: #8a8578; margin-bottom: 32px;">
          Enter this code to complete your signup:
        </p>
        <div style="background: #f5f3ef; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #3d3a35;">${code}</span>
        </div>
        <p style="font-size: 13px; color: #b5b0a6;">
          This code expires in 10 minutes. If you didn't request this, you can ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
