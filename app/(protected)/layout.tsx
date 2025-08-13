import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return <>{children}</>;
}
