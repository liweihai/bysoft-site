import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

export default function Footer() {
    return (
        <footer>
            <div className="-mx-6 bg-white px-6 py-12">
                <div className="mx-auto container text-gray-800 text-sm flex justify-between">
                    <span><Link href="https://www.bysoft.net.cn" className="text-black">{siteMetadata.author}</Link></span>
                    <span>© copyright 2018</span>
                </div>
            </div>
        </footer>
    )
}