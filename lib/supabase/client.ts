import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // During build time (static generation), env vars might be missing in some setups.
    // Providing specific fallback values satisfies the createBrowserClient requirement
    // and allows the build to complete. The actual client isn't used during static build.
    if (!url || !key) {
        if (typeof window === 'undefined') {
            console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Using placeholder for build.')
            return createBrowserClient(
                'https://placeholder.supabase.co',
                'placeholder'
            )
        }
        // In the browser, this is a real error.
        throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required!')
    }

    return createBrowserClient(url, key)
}
