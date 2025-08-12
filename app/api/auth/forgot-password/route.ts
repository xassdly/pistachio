import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import * as sib from '@sendinblue/client';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "If a user with that email exists, a reset link has been sent." }, { status: 200 });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000);

    await prisma.passwordResetToken.create({
      data: { email, token, expires },
    });
    
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password/${token}`;

    // --- ПРАВИЛЬНА ІНІЦІАЛІЗАЦІЯ І ВІДПРАВКА ---
    // 2. Створюємо екземпляр API та встановлюємо ключ
    const apiInstance = new sib.TransactionalEmailsApi();
    apiInstance.setApiKey(sib.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);
    
    // 3. Створюємо об'єкт листа
    const sendSmtpEmail = new sib.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = { email: "xassdly@gmail.com", name: "Pistachio App" };
    sendSmtpEmail.subject = "Reset your password for Pistachio";
    sendSmtpEmail.htmlContent = `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;
    
    // 4. Відправляємо
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    return NextResponse.json({ message: "If a user with that email exists, a reset link has been sent." }, { status: 200 });
    
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}