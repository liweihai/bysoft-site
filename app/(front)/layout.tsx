import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="mx-auto max-w-6xl bg-white py-20 px-12 shadow-xl mb-24">
                {children}
            </main>
            <Footer />
        </>
    )
}