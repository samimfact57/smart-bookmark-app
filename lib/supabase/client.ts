"use client"

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Debugging: Log what we see (safely masking the key)
    if (typeof window !== 'undefined') {
        const keyStatus = key ? `Present (${key.slice(0, 5)}...)` : 'Missing'
        console.log(`Supabase Client Init: URL=${url || 'Missing'}, Key=${keyStatus}`)
    }

    if (!url || !key) {
        if (typeof window === 'undefined') {
            console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Using placeholder for build.')
            return createBrowserClient(
                'https://placeholder.supabase.co',
                'placeholder'
            )
        }

        // Improve error message for the user
        throw new Error(
            `Supabase config missing! URL: ${url ? 'Found' : 'Missing'}, Key: ${key ? 'Found' : 'Missing'}. ` +
            `Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel Project Settings.`
        )
    }

    return createBrowserClient(url, key)
}
