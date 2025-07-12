'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import siteMetadata from '@/data/siteMetadata'
import {
  HomeIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  Battery50Icon,
  RectangleGroupIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

export default function SideNav({role}) {
    const pathname = usePathname();

    const links = [
        {
            icon: HomeIcon,
            name: '控制台',
            href: '/dashboard'
        },
        {
            icon: RectangleGroupIcon,
            name: '模型组',
            href: '/dashboard/quotagroup'
        },
        {
            icon: KeyIcon,
            name: 'Api Key',
            href: '/dashboard/apikey'
        },
    ]
    if (role == 1) {
        links.push({
            icon: Battery50Icon,
            name: '大模型',
            href: '/dashboard/endpoint'
        })
        links.push({
            icon: DocumentDuplicateIcon,
            name: '文章',
            href: '/dashboard/blog'
        })
        links.push({
            icon: Cog6ToothIcon,
            name: '配置',
            href: '/dashboard/config'
        })
    }

    return (
        <>
        <div className="justify-between sidebar-header flex items-center gap-2 pt-8 pb-7 justify-between text-lg  font-bold">
            <Link href="/">
                {siteMetadata.headerTitle}
            </Link>
        </div>
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
            <ul className="mb-6 flex flex-col gap-4">
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <li key={link.name}>
                        <Link
                            href={link.href}
                            className={clsx(
                                'menu-item group flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                                {
                                    'bg-sky-100 text-blue-600': pathname === link.href,
                                },
                            )}            
                        >
                            <LinkIcon className="w-6" />
                            <p className="hidden md:block menu-item-text">{link.name}</p>
                        </Link>
                    </li>
                );
            })}
            </ul>
        </div>
        </>
    );
}