import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: Params) {
  try {
    const { id } = await context.params;
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

    const chatId = Number(id);
    if (isNaN(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId,
        chat: { userId: session.userId },
      },
      orderBy: { createdAt: "asc" },
      select: { role: true, content: true },
    });

    const formatted = messages.map((m) => ({
      role: m.role.toLowerCase() as "user" | "assistant",
      content: m.content,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
