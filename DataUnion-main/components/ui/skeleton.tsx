// Skeleton loading components for dashboard and lists

export function StatCardSkeleton() {
    return (
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/5 rounded-lg"></div>
                <div className="h-3 w-24 bg-white/5 rounded"></div>
            </div>
            <div className="h-8 w-16 bg-white/5 rounded"></div>
        </div>
    );
}

export function ListItemSkeleton() {
    return (
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                        <div className="h-4 w-40 bg-white/5 rounded"></div>
                    </div>
                    <div className="h-16 bg-white/5 rounded-lg"></div>
                    <div className="h-3 w-32 bg-white/5 rounded"></div>
                </div>
                <div className="ml-6 space-y-2">
                    <div className="h-4 w-16 bg-white/5 rounded"></div>
                    <div className="h-6 w-12 bg-white/5 rounded"></div>
                </div>
            </div>
        </div>
    );
}

export function PayoutItemSkeleton() {
    return (
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-5 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-5 w-48 bg-white/5 rounded"></div>
                    <div className="h-4 w-24 bg-white/5 rounded"></div>
                </div>
                <div className="text-right space-y-2">
                    <div className="h-7 w-20 bg-white/5 rounded"></div>
                    <div className="h-3 w-16 bg-white/5 rounded"></div>
                </div>
            </div>
        </div>
    );
}
