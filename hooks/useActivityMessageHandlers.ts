"use client"

import { useDispatch } from "react-redux"
import mqttService, { msgActivityInterface } from "@/services/mqttService"
import { incrementTotalUnreadActivityCount } from "@/store/slice/userSlice"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

interface UseActivityMessageHandlersProps {
    userUuid?: string
}

export const useActivityMessageHandlers = ({ userUuid }: UseActivityMessageHandlersProps) => {
    const dispatch = useDispatch()
    const totalUnreadActivityCount = useSelector((state: RootState) => state.users.userSidebar.totalUnreadActivityCount)

    const handleActivityMessage = (messageStr: string) => {
        try {
            const rawActivity = mqttService.parseActivityMsg(messageStr)
            const activityData: msgActivityInterface = rawActivity.data

            if (activityData.user_uuid === userUuid) {
                // The backend sends the full activity object, but we only need to increment for the sidebar badge
                dispatch(incrementTotalUnreadActivityCount())
            }
        } catch (error) {
            console.error("[MQTT] Activity message processing error:", error)
        }
    }

    return {
        handleActivityMessage,
    }
}
