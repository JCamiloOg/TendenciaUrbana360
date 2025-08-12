import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl">
            <Skeleton className="h-70 rounded-b-none rounded-t-xl   w-full mb-3 bg-gray-500/30" />
            <div className="space-y-2 p-5">
                <Skeleton className="h-4 w-[250px] bg-gray-500/30" />
                <Skeleton className="h-4 w-[200px] bg-gray-500/30 mt-4" />
            </div>
        </div>
    )
}
