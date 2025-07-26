import { PowerIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

import { Suspense } from 'react'

import { signOut, auth } from '@/auth';
import SideNav from '@/components/dashboard/SideNav';
import {getModel} from "@/lib/data"
import {Customer} from "@/lib/definitions"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    const customer = await getModel<Customer>("Customer", session.user.id)

    return (
        <div>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                <div className="sidebar fixed top-0 left-0 z-9999 flex h-screen w-[290px] flex-col overflow-y-auto border-r border-gray-200 bg-white px-5 transition-all duration-300 lg:static lg:translate-x-0 dark:border-gray-800 dark:bg-black -translate-x-full">
                    <Suspense>
                        <SideNav role={customer.role} />
                    </Suspense>
                </div>
                <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                    <header className="sticky top-0 z-99999 flex w-full border-gray-200 bg-white lg:border-b dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4 dark:border-gray-800">
                        </div>
                        <div className="shadow-theme-md w-full items-center justify-between gap-4 px-10 py-4 lg:flex lg:justify-end lg:px-0 lg:shadow-none hidden">
                            <Menu as="div" className="relative mr-8">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">打开菜单</span>
                                    <Image
                                        alt=""
                                        src={customer.avatar}
                                        className="size-8 rounded-full"
                                        width="50"
                                        height="50"
                                    />
                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                                <MenuItem>
                                    <form
                                        action={async (formData) => {
                                            "use server"
                                            await signOut({ redirectTo: '/', redirect:true })
                                        }}
                                    >
                                        <button type="submit" className="text-left w-full cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden">退出</button>
                                    </form>
                                </MenuItem>
                            </MenuItems>
                            </Menu>
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