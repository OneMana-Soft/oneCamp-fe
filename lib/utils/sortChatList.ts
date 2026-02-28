import {UserDMInterface} from "@/types/user";

export const sortChatList = (usersDm: UserDMInterface[]) => {

    return usersDm.slice().sort((a, b) => {
        // Compare unread messages
        const unreadDiff = (b.dm_unread || 0) - (a.dm_unread || 0);
        if (unreadDiff !== 0) return unreadDiff;

        // Check if chat creation dates exist
        const aDate = a.dm_chats?.[0]?.chat_created_at;
        const bDate = b.dm_chats?.[0]?.chat_created_at;

        // Handle cases where one or both dates are undefined
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;

        // Compare dates
        return bDate > aDate ? 1 : -1;
    });
}