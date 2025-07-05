import { PowerIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

import { signOut } from '@/auth';
import SideNav from '@/components/dashboard/SideNav';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
          <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
              <div className="sidebar fixed top-0 left-0 z-9999 flex h-screen w-[290px] flex-col overflow-y-auto border-r border-gray-200 bg-white px-5 transition-all duration-300 lg:static lg:translate-x-0 dark:border-gray-800 dark:bg-black -translate-x-full">
                  <SideNav />
              </div>
              <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                <header className="sticky top-0 z-99999 flex w-full border-gray-200 bg-white lg:border-b dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4 dark:border-gray-800">
                    </div>
                    <div className="shadow-theme-md w-full items-center justify-between gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0 lg:shadow-none hidden">
                        <span className="flex items-center text-gray-700 dark:text-gray-400">
                            <span className="mr-3 h-11 w-11 overflow-hidden rounded-full">
                                <Image src="/logo.png" width="44" height="44" alt="avatar" />
                            </span>
                        </span>
                    </div>
                </header>
                <div className="mx-auto w-(--breakpoint-2xl) p-4 md:p-6">
                {children}
                </div>
            </div>
          </div>
        </div>
    );
}