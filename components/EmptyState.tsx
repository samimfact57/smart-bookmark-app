import { Bookmark } from "lucide-react"

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="p-4 bg-muted rounded-full mb-4">
                <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No bookmarks yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Add your first link above to get started. Your bookmarks will appear here instantly.
            </p>
        </div>
    )
}
