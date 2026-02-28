"use client"

interface ReplyDividerProps {
    replyCount: number
}

export const ReplyDivider = ({ replyCount }: ReplyDividerProps) => {
    return (

        <div className="relative mx-4 ">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"/>
            </div>
            <div className="relative flex justify-start">
        <div className="bg-background pr-3 text-sm text-muted-foreground">
          {replyCount} {replyCount === 1 ? "reply" : "replies"}
        </div>
            </div>
        </div>
    )
}
