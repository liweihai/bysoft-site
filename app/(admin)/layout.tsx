
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
        <section className="mx-auto px-4 sm:px-6 xl:px-0">
            <main className="mb-auto">
                {children}
            </main>
        </section>
  )
}