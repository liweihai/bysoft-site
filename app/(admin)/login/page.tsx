import { Suspense } from 'react';

import LoginForm from '@/components/LoginForm';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
        <Suspense>
          <LoginForm />
        </Suspense>
    </main>
  );
}