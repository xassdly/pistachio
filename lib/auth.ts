import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: Number(sessionId) },
    include: { user: { select: { id: true, email: true } } },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}
