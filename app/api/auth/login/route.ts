import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { COOKIE_NAME } from '@/lib/auth';

const schema = z.object({
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Senha inválida.' }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD || parsed.data.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, process.env.ADMIN_PASSWORD, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });

  return NextResponse.json({ ok: true });
}
