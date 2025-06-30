import { useEffect, useState } from 'react'
import { UserEmojiStatus} from "@/types/user";


export function useStatusIsExpired(status?: UserEmojiStatus | null) {
    const getIsExpired = (expiresAt?: string | null) =>
        expiresAt ? new Date(expiresAt).getTime() < new Date().getTime() : false

    const [isExpired, setIsExpired] = useState(getIsExpired(status?.status_user_emoji_expiry_at))

    useEffect(() => {
        setIsExpired(getIsExpired(status?.status_user_emoji_expiry_at))

        const interval = setInterval(() => {
            setIsExpired(getIsExpired(status?.status_user_emoji_expiry_at))
        }, 1000 * 60)

        return () => clearInterval(interval)
    }, [status?.status_user_emoji_expiry_in])

    return isExpired
}
