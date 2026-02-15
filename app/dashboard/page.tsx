import { AddBookmarkForm } from "@/components/AddBookmarkForm"
import { BookmarkList } from "@/components/BookmarkList"

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h1 className="heading-lg">Bookmarks</h1>
                <p className="text-sm text-secondary">
                    Manage your personal bookmarks with real-time sync.
                </p>
            </div>

            <AddBookmarkForm />

            <BookmarkList />
        </div>
    )
}
