import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} env is missing`);
  return v;
}
const DUMMY_PW_HASH = requireEnv('DUMMY_PW_HASH');

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const emailRaw = body?.email as string | undefined;
    const password = body?.password as string | undefined;

    if (!emailRaw || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const email = emailRaw.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });
    
    const hashToCheck = user?.password ?? DUMMY_PW_HASH;
    const isValid = await bcrypt.compare(password, hashToCheck);
    
    if (!user || !user.password || !isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const expiresAt = new Date(Date.now() + 7*24*60*60*1000);
    const session = await prisma.session.create({
      data: { userId: user.id, expiresAt },
    });

    const res = NextResponse.json({ id: user.id, email: user.email });
    res.cookies.set('session', String(session.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
