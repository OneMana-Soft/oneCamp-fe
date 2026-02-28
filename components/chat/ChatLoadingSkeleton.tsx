import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils/helpers/cn"

export const ChatLoadingSkeleton = () => {
    return (
        <div className="flex flex-col w-full h-full overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="flex pl-4 space-x-4 pb-4 pt-4 w-full">
                    {/* Avatar */}
                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                    
                    <div className="flex-1 space-y-2">
                        {/* Name and Time */}
                        <div className="flex items-baseline space-x-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                        
                        {/* Message Body - Random widths for realism */}
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-[90%]" />
                            <Skeleton className={cn("h-4", i % 2 === 0 ? "w-[70%]" : "w-[40%]")} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
