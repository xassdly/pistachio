import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { chatId, messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: Number(sessionId) },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    let chat;

    if (chatId) {
      chat = await prisma.chat.update({
        where: { id: chatId, userId: session.userId },
        data: {
          messages: {
            create: messages.map((m: { role: 'user' | 'assistant'; content: string }) => ({
              role: m.role === 'user' ? Role.USER : Role.ASSISTANT,
              content: m.content,
            })),
          },
        },
        include: { messages: true },
      });
    } else {
      chat = await prisma.chat.create({
        data: {
          userId: session.userId,
          messages: {
            create: messages.map((m: { role: 'user' | 'assistant'; content: string }) => ({
              role: m.role === 'user' ? Role.USER : Role.ASSISTANT,
              content: m.content,
            })),
          },
        },
        include: { messages: true },
      });
    }

    return NextResponse.json(chat);

  } catch (error) {
    console.error('Save chat error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
