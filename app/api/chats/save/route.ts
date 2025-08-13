// app/api/chats/save/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { getCurrentUser } from '@/lib/getCurrentUser';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId, messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    let chat;

    if (chatId) {
      const chatToUpdate = await prisma.chat.findUnique({ where: { id: chatId } });
      if (chatToUpdate?.userId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      chat = await prisma.chat.update({
        where: { id: chatId },
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
          userId: user.id,
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