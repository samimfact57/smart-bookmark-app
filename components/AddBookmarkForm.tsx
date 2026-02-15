"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AddBookmarkForm() {
    const [url, setUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()
    const supabase = createClient()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url || !user) return

        setIsLoading(true)

        try {
            // Simple title extraction (in a real app, maybe fetch metatags via generic API)
            let title = url
            try {
                const urlObj = new URL(url)
                title = urlObj.hostname
            } catch {
                // keep original if invalid url
            }

            const { error } = await supabase.from('bookmarks').insert({
                user_id: user.id,
                url,
                title,
            })

            if (error) throw error

            setUrl("")
            toast({
                title: "Bookmark added",
                description: "Your new bookmark has been saved.",
                duration: 3000
            })

        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add bookmark. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1 bg-background transition-all focus:ring-2 focus:ring-ring/30"
                disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !url.trim()}>
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Plus className="w-4 h-4" />
                )}
                <span className="ml-2 hidden sm:inline">Add</span>
            </Button>
        </form>
    )
}
