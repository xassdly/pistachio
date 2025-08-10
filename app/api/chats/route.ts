import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export type ChatResponse = {
  id: number;
  updatedAt: string;
};

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    return NextResponse.json<ChatResponse[]>([], { status: 401 });
  }

  const session = await prisma.session.findUnique({
    where: { id: Number(sessionId) },
    include: { user: { select: { id: true } } },
  });

  if (!session || session.expiresAt < new Date()) {
    return NextResponse.json<ChatResponse[]>([], { status: 401 });
  }

  const chats = await prisma.chat.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(
    chats.map((c) => ({ ...c, updatedAt: c.updatedAt.toISOString() }))
  );
}
