"use client"

import { useCallback } from "react"
import { useDispatch } from "react-redux"
import mqttService from "@/services/mqttService"
import { addChannelTyping, RemoveChannelTyping, addChatTyping, RemoveChatTyping } from "@/store/slice/typingSlice"
import {ConnectionConfig, TypingTimeout} from "@/types/mqtt";

interface UseTypingHandlersProps {
    connectionConfig: ConnectionConfig
    userUuid?: string
    typingTimeouts: Map<string, TypingTimeout>
}

export const useTypingHandlers = ({ connectionConfig, userUuid, typingTimeouts }: UseTypingHandlersProps) => {
    const dispatch = useDispatch()

    const clearTypingTimeout = useCallback(
        (key: string) => {
            const timeout = typingTimeouts.get(key)
            if (timeout) {
                clearTimeout(timeout.timer)
                typingTimeouts.delete(key)
            }
        },
        [typingTimeouts],
    )

    const setTypingTimeout = useCallback(
        (key: string, userId: string, callback: () => void) => {
            clearTypingTimeout(key)

            const timer = setTimeout(callback, connectionConfig.typingTimeout)
            typingTimeouts.set(key, { userId, timer })
        },
        [clearTypingTimeout, connectionConfig.typingTimeout, typingTimeouts],
    )

    const handleChannelTyping = useCallback(
        (messageStr: string) => {
            try {
                const mqttChannelTyping = mqttService.parseChannelTypingMsg(messageStr)

                if (userUuid === mqttChannelTyping.data.user_uuid) {
                    return
                }

                const timeoutKey = `channel_${mqttChannelTyping.data.channel_id}_${mqttChannelTyping.data.user_uuid}`

                setTypingTimeout(timeoutKey, mqttChannelTyping.data.user_uuid, () => {
                    dispatch(
                        RemoveChannelTyping({
                            userId: mqttChannelTyping.data.user_uuid,
                            channelId: mqttChannelTyping.data.channel_id,
                        }),
                    )
                })

                dispatch(
                    addChannelTyping({
                        timer: typingTimeouts.get(timeoutKey)?.timer,
                        user: {
                            user_uuid: mqttChannelTyping.data.user_uuid,
                            user_name: mqttChannelTyping.data.user_name,
                            user_profile_object_key: mqttChannelTyping.data.user_profile,

                        },
                        channelId: mqttChannelTyping.data.channel_id,
                    }),
                )
            } catch (error) {
                console.error("[MQTT] Channel typing message handling error:", error)
            }
        },
        [dispatch, userUuid, setTypingTimeout, typingTimeouts],
    )

    const handleChatTyping = useCallback(
        (messageStr: string) => {
            try {
                const mqttChatTyping = mqttService.parseChatTypingMsg(messageStr)

                if (userUuid === mqttChatTyping.data.user_uuid) {
                    return
                }

                const timeoutKey = `chat_${mqttChatTyping.data.user_uuid}`

                setTypingTimeout(timeoutKey, mqttChatTyping.data.user_uuid, () => {
                    dispatch(
                        RemoveChatTyping({
                            userId: mqttChatTyping.data.user_uuid,
                            chatId: mqttChatTyping.data.user_uuid,
                        }),
                    )
                })

                dispatch(
                    addChatTyping({
                        timer: typingTimeouts.get(timeoutKey)?.timer,
                        user: {
                            user_uuid: mqttChatTyping.data.user_uuid,
                            user_name: mqttChatTyping.data.user_name,
                            user_profile_object_key: mqttChatTyping.data.user_profile,
                        },
                        chatId: mqttChatTyping.data.user_uuid,
                    }),
                )
            } catch (error) {
                console.error("[MQTT] Chat typing message handling error:", error)
            }
        },
        [dispatch, userUuid, setTypingTimeout, typingTimeouts],
    )

    return {
        handleChannelTyping,
        handleChatTyping,
        clearTypingTimeout,
    }
}
