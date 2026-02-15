export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex flex-col space-y-6">
            {children}
        </section>
    )
}
