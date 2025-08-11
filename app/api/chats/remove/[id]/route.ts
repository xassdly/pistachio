import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

type Params = { params: { id: string } };

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: Number(sessionId) },
      select: { userId: true, expiresAt: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatId = Number(params.id);
    if (Number.isNaN(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    const deletedCount = await prisma.$transaction(async (tx) => {
      await tx.message.deleteMany({
        where: { chatId, chat: { userId: session.userId } },
      });
      const { count } = await tx.chat.deleteMany({
        where: { id: chatId, userId: session.userId },
      });
      return count;
    });

    if (deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error removing chat:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
