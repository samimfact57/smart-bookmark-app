export default function Loading() {
    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <div className="h-7 w-[160px] rounded-lg bg-primary-soft animate-pulse" />
                <div className="h-5 w-[280px] rounded-lg bg-primary-soft animate-pulse" />
            </div>

            <div className="flex gap-2">
                <div className="h-9 flex-1 rounded-lg bg-primary-soft animate-pulse" />
                <div className="h-9 w-[72px] rounded-lg bg-primary-soft animate-pulse" />
            </div>

            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[72px] w-full rounded-xl bg-surface-secondary border border-subtle animate-pulse" />
                ))}
            </div>
        </div>
    )
}
