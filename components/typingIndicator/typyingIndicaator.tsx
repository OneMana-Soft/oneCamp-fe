"use client"
import { cn } from "@/lib/utils/cn"
import {UserProfileDataInterface} from "@/types/user";
import {TypingAvatar} from "@/components/typingIndicator/typinngAvatar";

interface TypingIndicatorProps {
    users: UserProfileDataInterface[]
    className?: string
}

export function TypingIndicator({ users, className }: TypingIndicatorProps) {
    if (users.length === 0) return null

    const getTypingText = () => {
        if (users.length === 1) {
            return users[0].user_name
        } else if (users.length === 2) {
            return `${users[0].user_name}, ${users[1].user_name}`
        } else {
            return `${users[0].user_name} and ${users.length - 1} other${users.length > 2 ? "s" : ""}`
        }
    }

    const renderAvatars = () => {
        const displayUsers = users.slice(0, 3) // Show max 3 avatars

        return (
            <div className="flex -space-x-1">
                {displayUsers.map((user) => (
                    <TypingAvatar key={user.user_uuid} userName={user.user_name} userProfileObjKey={user.user_profile_object_key}/>
                ))}
                {users.length > 3 && (
                    <div className="w-5 h-5 rounded-full bg-muted border border-background flex items-center justify-center">
                        <span className="text-[8px] font-medium text-muted-foreground">+{users.length - 3}</span>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground/70 animate-in fade-in-0 duration-200",
                className,
            )}
            role="status"
            aria-live="polite"
            aria-label={`${getTypingText()} ${users.length === 1 ? "is" : "are"} typing`}
        >
            {renderAvatars()}

            <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-muted-foreground/50 rounded-full animate-pulse [animation-delay:0ms] [animation-duration:1.4s]" />
                <div className="w-1 h-1 bg-muted-foreground/50 rounded-full animate-pulse [animation-delay:200ms] [animation-duration:1.4s]" />
                <div className="w-1 h-1 bg-muted-foreground/50 rounded-full animate-pulse [animation-delay:400ms] [animation-duration:1.4s]" />
            </div>

            <span className="font-medium">{getTypingText()}</span>
            <span className="text-muted-foreground/50">typing</span>
        </div>
    )
}
