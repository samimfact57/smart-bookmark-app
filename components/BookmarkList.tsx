"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/AuthProvider"
import { BookmarkCard } from "./BookmarkCard"
import { EmptyState } from "./EmptyState"
import { Spin } from "@openai/apps-sdk-ui/components/Icon"

interface Bookmark {
    id: string
    title: string
    url: string
    created_at: string
}

function getDemoBookmarks(): Bookmark[] {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem('demo_bookmarks')
    return raw ? JSON.parse(raw) : []
}

export function BookmarkList() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(true)
    const { user, isDemo } = useAuth()
    const supabase = createClient()

    const loadDemoBookmarks = useCallback(() => {
        setBookmarks(getDemoBookmarks())
        setLoading(false)
    }, [])

    useEffect(() => {
        if (!user) return

        if (isDemo) {
            loadDemoBookmarks()
            // Listen for changes from AddBookmarkForm and BookmarkCard
            window.addEventListener('demo-bookmarks-changed', loadDemoBookmarks)
            return () => {
                window.removeEventListener('demo-bookmarks-changed', loadDemoBookmarks)
            }
        }

        // Supabase mode
        const fetchBookmarks = async () => {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error && data) {
                setBookmarks(data)
            }
            setLoading(false)
        }

        fetchBookmarks()

        // Realtime subscription
        const channel = supabase
            .channel('realtime-bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) => prev.map((b) => b.id === payload.new.id ? payload.new as Bookmark : b))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, isDemo, supabase, loadDemoBookmarks])

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Spin className="size-8 animate-spin text-secondary" />
            </div>
        )
    }

    if (bookmarks.length === 0) {
        return <EmptyState />
    }

    return (
        <div className="grid gap-3">
            {bookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
        </div>
    )
}
