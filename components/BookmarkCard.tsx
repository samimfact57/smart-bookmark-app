"use client"

import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/AuthProvider"
import { Button } from "@openai/apps-sdk-ui/components/Button"
import { Trash, ExternalLink, Globe } from "@openai/apps-sdk-ui/components/Icon"
import { Tooltip } from "@openai/apps-sdk-ui/components/Tooltip"
import { useState } from "react"

interface Bookmark {
    id: string
    title: string
    url: string
    created_at: string
}

export function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const { isDemo } = useAuth()
    const supabase = createClient()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            if (isDemo) {
                const raw = localStorage.getItem('demo_bookmarks')
                const bookmarks: Bookmark[] = raw ? JSON.parse(raw) : []
                const updated = bookmarks.filter(b => b.id !== bookmark.id)
                localStorage.setItem('demo_bookmarks', JSON.stringify(updated))
                window.dispatchEvent(new Event('demo-bookmarks-changed'))
            } else {
                const { error } = await supabase
                    .from('bookmarks')
                    .delete()
                    .eq('id', bookmark.id)
                if (error) throw error
            }
        } catch (error) {
            console.error(error)
            setIsDeleting(false)
        }
    }

    let hostname = ""
    try {
        hostname = new URL(bookmark.url).hostname
    } catch {
        hostname = "link"
    }

    return (
        <div className={`group relative flex items-center justify-between p-4 rounded-xl border border-default bg-surface-elevated shadow-hairline hover:shadow-sm hover:border-strong transition-all duration-200 ${isDeleting ? 'opacity-40 pointer-events-none scale-[0.98]' : ''}`}>
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary-soft flex items-center justify-center text-secondary">
                    <Globe className="size-5" />
                </div>
                <div className="flex flex-col min-w-0">
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-default truncate hover:underline underline-offset-4"
                    >
                        {bookmark.title}
                    </a>
                    <span className="text-xs text-tertiary truncate">{hostname}</span>
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip content="Open link">
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button color="secondary" variant="ghost" size="xs" uniform>
                            <ExternalLink className="size-4" />
                        </Button>
                    </a>
                </Tooltip>
                <Tooltip content="Delete">
                    <Button
                        color="danger"
                        variant="ghost"
                        size="xs"
                        uniform
                        onClick={handleDelete}
                    >
                        <Trash className="size-4" />
                    </Button>
                </Tooltip>
            </div>
        </div>
    )
}
