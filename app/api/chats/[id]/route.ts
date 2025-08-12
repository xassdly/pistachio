import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const url = new URL(req.url);

    const chatIdString = url.pathname.split('/').pop();
    const chatId = Number(chatIdString);

    if (!chatIdString || isNaN(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId: chatId,
        chat: { userId: user.id },
      },
      orderBy: { createdAt: "asc" },
      select: { role: true, content: true },
    });

    if (messages.length === 0) {
      const chatExists = await prisma.chat.findFirst({
        where: { id: chatId, userId: user.id },
      });
      if (!chatExists) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
    }

    const formatted = messages.map((m) => ({
      role: m.role.toLowerCase() as "user" | "assistant",
      content: m.content,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}