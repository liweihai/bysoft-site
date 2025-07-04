import '/css/tailwind.css'

import { Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Metadata } from 'next'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'

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
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
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
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
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

      <body className="bg-gray-200 font-sans font-thin px-6 bg-fixed bg-cover bg-no-repeat" style={{backgroundImage: "url('https://images.unsplash.com/photo-1523742238290-adf3b54101bf?w=1800')"}}>
        <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
            <Header />
            <main className="mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">{children}</main>
            <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}