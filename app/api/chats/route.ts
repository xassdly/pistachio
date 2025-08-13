import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export type ChatResponse = {
  id: number;
  updatedAt: string;
};

export async function GET() {

  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ChatResponse[]>([], { status: 401 });
    }

    const chats = await prisma.chat.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    const formattedChats = chats.map((c) => ({
      ...c,
      updatedAt: c.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedChats);

  } catch (error) {
    console.error("ERROR in /api/chats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}