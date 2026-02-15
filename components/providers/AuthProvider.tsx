'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { setCookie, deleteCookie, getCookie } from 'cookies-next'

const DEMO_USER_ID = 'demo-user-local'

type AuthContextType = {
    user: User | null
    session: Session | null
    isLoading: boolean
    isDemo: boolean
    signOut: () => Promise<void>
    signInWithGoogle: () => Promise<void>
    startDemo: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDemo, setIsDemo] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        // Check if there was a previous demo session (via cookie or local storage)
        const demoCookie = getCookie('demo_mode')
        const demoLocal = typeof window !== 'undefined' ? localStorage.getItem('demo_mode') : null

        if (demoCookie === 'true' || demoLocal === 'true') {
            setUser({ id: DEMO_USER_ID, user_metadata: { full_name: 'Demo User' } } as unknown as User)
            setIsDemo(true)
            setIsLoading(false)
            return
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                setIsLoading(false)
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase])

    const signOut = async () => {
        if (isDemo) {
            localStorage.removeItem('demo_mode')
            localStorage.removeItem('demo_bookmarks')
            deleteCookie('demo_mode')
            setIsDemo(false)
            setUser(null)
            // Reload to clear state and re-trigger middleware
            window.location.href = '/'
            return
        }
        await supabase.auth.signOut()
    }

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    const startDemo = () => {
        localStorage.setItem('demo_mode', 'true')
        setCookie('demo_mode', 'true', { maxAge: 60 * 60 * 24 * 365 }) // 1 year
        setUser({ id: DEMO_USER_ID, user_metadata: { full_name: 'Demo User' } } as unknown as User)
        setIsDemo(true)
        // Refresh to let middleware see the cookie
        window.location.reload()
    }

    return (
        <AuthContext.Provider value={{ user, session, isLoading, isDemo, signOut, signInWithGoogle, startDemo }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export { DEMO_USER_ID }
