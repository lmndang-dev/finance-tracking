import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ status: "invalid_credentials" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ status: "invalid_credentials" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return NextResponse.json({ status: "invalid_credentials" });

  if (!user.emailVerified) return NextResponse.json({ status: "unverified" });

  return NextResponse.json({ status: "ok" });
}
