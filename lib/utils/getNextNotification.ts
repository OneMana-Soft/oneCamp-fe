import {NotificationType} from "@/types/channel";

export const getNextNotification = (currentNotification: string): string => {
    switch(currentNotification) {
        case NotificationType.NotificationAll:
            return NotificationType.NotificationMention
        case NotificationType.NotificationMention:
            return NotificationType.NotificationBlock
        case NotificationType.NotificationBlock:
           return NotificationType.NotificationAll
        default:
            return NotificationType.NotificationAll
    }
}