import { EmptyMessage } from "@openai/apps-sdk-ui/components/EmptyMessage"
import { BookBookmark } from "@openai/apps-sdk-ui/components/Icon"

export function EmptyState() {
    return (
        <EmptyMessage>
            <EmptyMessage.Icon>
                <BookBookmark />
            </EmptyMessage.Icon>
            <EmptyMessage.Title>No bookmarks yet</EmptyMessage.Title>
            <EmptyMessage.Description>
                Add your first link above to get started. Your bookmarks will appear here instantly.
            </EmptyMessage.Description>
        </EmptyMessage>
    )
}
