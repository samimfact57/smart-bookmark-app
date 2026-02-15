"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/AuthProvider"
import { DEMO_USER_ID } from "@/components/providers/AuthProvider"
import { Button } from "@openai/apps-sdk-ui/components/Button"
import { Input } from "@openai/apps-sdk-ui/components/Input"
import { Plus } from "@openai/apps-sdk-ui/components/Icon"
import { Alert } from "@openai/apps-sdk-ui/components/Alert"

interface DemoBookmark {
    id: string
    title: string
    url: string
    created_at: string
    user_id: string
}

function getDemoBookmarks(): DemoBookmark[] {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem('demo_bookmarks')
    return raw ? JSON.parse(raw) : []
}

function saveDemoBookmarks(bookmarks: DemoBookmark[]) {
    localStorage.setItem('demo_bookmarks', JSON.stringify(bookmarks))
}

export function AddBookmarkForm() {
    const [url, setUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [alert, setAlert] = useState<{ color: "success" | "danger"; title: string } | null>(null)
    const { user, isDemo } = useAuth()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url || !user) return

        setIsLoading(true)
        setAlert(null)

        try {
            let title = url
            try {
                const urlObj = new URL(url)
                title = urlObj.hostname
            } catch {
                // keep original if invalid url
            }

            if (isDemo) {
                const existing = getDemoBookmarks()
                const newBookmark: DemoBookmark = {
                    id: crypto.randomUUID(),
                    title,
                    url,
                    created_at: new Date().toISOString(),
                    user_id: DEMO_USER_ID,
                }
                saveDemoBookmarks([newBookmark, ...existing])
                // Dispatch event so BookmarkList picks it up
                window.dispatchEvent(new Event('demo-bookmarks-changed'))
            } else {
                const { error } = await supabase.from('bookmarks').insert({
                    user_id: user.id,
                    url,
                    title,
                })
                if (error) throw error
            }

            setUrl("")
            setAlert({ color: "success", title: "Bookmark added" })
            setTimeout(() => setAlert(null), 3000)

        } catch (error) {
            console.error(error)
            setAlert({ color: "danger", title: "Failed to add bookmark" })
            setTimeout(() => setAlert(null), 5000)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    size="lg"
                    disabled={isLoading}
                    className="flex-1"
                />
                <Button
                    color="primary"
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    loading={isLoading}
                    size="lg"
                >
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">Add</span>
                </Button>
            </form>
            {alert && (
                <Alert
                    color={alert.color}
                    variant="soft"
                    title={alert.title}
                />
            )}
        </div>
    )
}
