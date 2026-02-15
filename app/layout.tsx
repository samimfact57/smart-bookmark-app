import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Smart Bookmark App',
  description: 'A minimal real-time bookmark manager.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen bg-surface text-default`}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-2xl mx-auto p-6">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
