import Image from "next/image";
import Link from './Link'

import siteMetadata from '@/data/siteMetadata'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'

import {countModels, findModels} from "@/lib/data"
import {Config} from "@/lib/definitions"

export default async function Header(){
    let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
    if (siteMetadata.stickyNav) {
      headerClass += ' sticky top-0 z-50'
    }

    const categoryConfigs = await findModels<Config>("Config", {name: 'categories'}, {limit: 1, offset: 0})

    const categories = categoryConfigs[0].value.split(",")
    const headerNavLinks = []
    headerNavLinks.push({ href: '/', title: '首页' })
    headerNavLinks.push({ href: '/prompt', title: '提示词' })
    headerNavLinks.push({ href: '/endpoint', title: 'Single LLM' })
    headerNavLinks.push({ href: '/contactus', title: '联系我们' })
    headerNavLinks.push({ href: '/dashboard', title: '控制台' })

    return (
        <header className="mx-auto max-w-xl py-20 text-center">
            <Link href="/" className="block text-2xl mb-12">{siteMetadata.headerTitle}</Link>

            <ul className="flex justify-center uppercase text-xs">
                {headerNavLinks
                  .map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="mx-4 hover:text-gray-600"
                    >
                      {link.title}
                    </Link>
                ))}
            </ul>
        </header>
    )
}