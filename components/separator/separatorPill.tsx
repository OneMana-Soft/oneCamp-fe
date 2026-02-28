import type React from "react"
import { cn } from "@/lib/utils/helpers/cn"

interface SeparatorPillProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    pillClassName?: string
    lineClassName?: string
}

export function SeparatorPill({ children, className, pillClassName, lineClassName, ...props }: SeparatorPillProps) {
    return (
        <div className={cn("relative flex items-center w-full", className)} {...props}>
    <div className={cn("flex-grow h-px bg-border", lineClassName)} />
    <div
    className={cn("px-3 py-1 mx-2 text-sm font-medium rounded-full bg-muted text-muted-foreground", pillClassName)}
>
    {children}
    </div>
    <div className={cn("flex-grow h-px bg-border", lineClassName)} />
    </div>
)
}

