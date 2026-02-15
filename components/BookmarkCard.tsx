"use client"

import { createClient } from "@/lib/supabase/client"
import { Trash2, ExternalLink, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface Bookmark {
    id: string
    title: string
    url: string
    created_at: string
}

export function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const supabase = createClient()
    const { toast } = useToast()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('id', bookmark.id)

            if (error) throw error

            // No need to manually update list, realtime subscription will handle it

        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete bookmark.",
            })
            setIsDeleting(false)
        }
    }

    // Parse hostname for favicon/display
    let hostname = ""
    try {
        hostname = new URL(bookmark.url).hostname
    } catch {
        hostname = "link"
    }

    return (
        <div className={`group relative flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all duration-200 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="h-10 w-10 shrink-0 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    {/* Ideally utilize a favicon service here */}
                    <Globe className="h-5 w-5" />
                </div>
                <div className="flex flex-col min-w-0">
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground truncate hover:underline underline-offset-4 decoration-accent/50"
                    >
                        {bookmark.title}
                    </a>
                    <span className="text-xs text-muted-foreground truncate">{hostname}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-accent transition-colors"
                >
                    <ExternalLink className="h-4 w-4" />
                </a>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </div>
        </div>
    )
}
