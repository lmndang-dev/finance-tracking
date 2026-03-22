import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body ?? {};

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { error: "No account found with that email address." },
      { status: 404 }
    );
  }

  if (!user.emailVerified) {
    return NextResponse.json(
      { error: "Your email is not verified. Please verify your account before resetting your password." },
      { status: 403 }
    );
  }

  // Delete any existing token for this email
  await prisma.passwordResetToken.deleteMany({ where: { email } });

  const token = randomUUID();
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  await sendPasswordResetEmail(email, token);

  return NextResponse.json({ ok: true });
}
