import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

interface DeleteChatContext {
  params: {
    id: string;
  };
}

export async function DELETE(_req: Request, context: DeleteChatContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatId = Number(context.params.id);
    if (Number.isNaN(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    const chatToDelete = await prisma.chat.findUnique({
        where: { id: chatId },
    });

    if (!chatToDelete || chatToDelete.userId !== user.id) {
        return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
    }

    await prisma.message.deleteMany({
      where: { chatId: chatId },
    });
    await prisma.chat.delete({
      where: { id: chatId },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error removing chat:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}