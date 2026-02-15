import { AddBookmarkForm } from "@/components/AddBookmarkForm"
import { BookmarkList } from "@/components/BookmarkList"

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Bookmarks</h1>
                <p className="text-muted-foreground">
                    Manage your personal bookmarks with real-time sync.
                </p>
            </div>

            <AddBookmarkForm />

            <BookmarkList />
        </div>
    )
}
