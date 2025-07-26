import '/css/tailwind.css'

import { Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Metadata } from 'next'
import { useEffect } from 'react';
import Script from 'next/script'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'

import { Toaster } from "@/components/ui/sonner"

const space_grotesk = Space_Grotesk({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
        default: siteMetadata.title,
        template: `%s | ${siteMetadata.title}`,
    },
    description: siteMetadata.description,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
      },
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const basePath = process.env.BASE_PATH || ''

    return (
        <html
            lang={siteMetadata.language}
            className={`${space_grotesk.variable} scroll-smooth`}
            suppressHydrationWarning
        >
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href={`${basePath}/logo.png`}
            />
            <meta name="msapplication-TileColor" content="#000000" />
            <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
            <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
            <Script id="gtm">{"(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-K5XGRDN8');"}</Script>
            <Script id="bdtj" strategy="beforeInteractive">{'var _hmt = _hmt || [];(function() {  var hm = document.createElement("script");  hm.src = "https://hm.baidu.com/hm.js?8f3bb053dae14655379dbf06f13706ca";  var s = document.getElementsByTagName("script")[0];   s.parentNode.insertBefore(hm, s);})();'}</Script>
            <body className="bg-gray-200 font-sans font-thin px-6 bg-fixed bg-cover bg-no-repeat" style={{backgroundImage: "url('https://images.unsplash.com/photo-1523742238290-adf3b54101bf?w=1800')"}}>
                <Header />
                <main className="mx-auto max-w-6xl bg-white py-20 px-12 shadow-xl mb-24">{children}</main>
                <Toaster richColors/>
                <Footer />
            </body>
        </html>
    )
}