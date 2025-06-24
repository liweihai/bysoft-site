import { PowerIcon } from '@heroicons/react/24/outline';

import { signOut } from '@/auth';
import SideNav from '@/components/dashboard/SideNav';
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />

      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
              <PowerIcon className="w-6" />
              <div className="hidden md:block">退出</div>
            </button>
          </form>
        </div>
        <div className="flex-grow px-6 md:overflow-y-auto md:px-12">{children}</div>
      </div>
      
      <Footer />
    </div>
  );
}