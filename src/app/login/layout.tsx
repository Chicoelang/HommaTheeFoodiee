import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Masuk ke akun HoomaFoodie kamu',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
