import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });

  } catch (err: any) {
    console.error('SIGNUP API ERROR:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}