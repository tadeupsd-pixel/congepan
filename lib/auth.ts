import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'pc_admin_session';

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(session && expected && session === expected);
}

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    redirect('/admin/login');
  }
}

export async function ensureAdminApi() {
  return isAdminAuthenticated();
}

export { COOKIE_NAME };
