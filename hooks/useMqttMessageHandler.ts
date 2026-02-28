"use client"

import { useCallback, useRef } from "react"
import { MqttMessageType, type msgType } from "@/services/mqttService"
import { usePostMessageHandlers } from "./usePostMessageHandlers"
import { useChatMessageHandlers } from "./useChatMessageHandlers"
import { useTypingHandlers } from "./useTypingHandlers"
import {ConnectionConfig, TypingTimeout} from "@/types/mqtt";
import {useUserMessageHandlers} from "@/hooks/useUserMessageHandlers";
import {useTaskMessageHandlers} from "@/hooks/useTaskMessageHandlers";
import {useDocMessageHandlers} from "@/hooks/useDocMessageHandlers";
import {useActivityMessageHandlers} from "@/hooks/useActivityMessageHandlers";

interface UseMqttMessageHandlerProps {
    connectionConfig: ConnectionConfig
    userUuid?: string
}

export const useMqttMessageHandler = ({ connectionConfig, userUuid }: UseMqttMessageHandlerProps) => {
    const typingTimeouts = useRef<Map<string, TypingTimeout>>(new Map())

    const userHandlers = useUserMessageHandlers({ userUuid })
    const postHandlers = usePostMessageHandlers({ userUuid })
    const chatHandlers = useChatMessageHandlers({ userUuid })
    const typingHandlers = useTypingHandlers({
        connectionConfig,
        userUuid,
        typingTimeouts: typingTimeouts.current,
    })

    const taskHandler = useTaskMessageHandlers({ userUuid })
    const docHandler = useDocMessageHandlers({ userUuid })
    const activityHandler = useActivityMessageHandlers({ userUuid })

    const handleMessage = useCallback(
        (topic: string, message: Buffer) => {
            try {
                const messageStr = message.toString()
                const parsedMessage: msgType = JSON.parse(messageStr)

                switch (parsedMessage.type) {
                    case MqttMessageType.Post:
                        postHandlers.handlePostMessage(messageStr)
                        break

                    case MqttMessageType.Post_Reaction:
                        postHandlers.handlePostReactionMessage(messageStr)
                        break

                    case MqttMessageType.Channel_call:
                        postHandlers.handleChannelCallMessage(messageStr)
                        break

                    case MqttMessageType.Post_Comment_Reaction:
                        postHandlers.handlePostCommentReactionMessage(messageStr)
                        break

                    case MqttMessageType.Post_Comment:
                        postHandlers.handlePostCommentMessage(messageStr)
                        break

                    case MqttMessageType.Chat:
                        chatHandlers.handleChatMessage(messageStr)
                        break

                    case MqttMessageType.Chat_Reaction:
                        chatHandlers.handleChatReactionMessage(messageStr)
                        break

                    case MqttMessageType.Chat_Comment_Reaction:
                        chatHandlers.handleChatCommentReactionMessage(messageStr)
                        break

                    case MqttMessageType.Chat_Comment:
                        chatHandlers.handleChatCommentMessage(messageStr)
                        break

                    case MqttMessageType.Channel_Typing:
                        typingHandlers.handleChannelTyping(messageStr)
                        break

                    case MqttMessageType.Chat_call:
                        chatHandlers.handleChatCallMessage(messageStr)
                        break

                    case MqttMessageType.Chat_Typing:
                        typingHandlers.handleChatTyping(messageStr)
                        break

                    case MqttMessageType.User_Emoji_Status:
                        userHandlers.handleUserEmojiMessage(messageStr)
                        break

                    case MqttMessageType.User_Status:
                        userHandlers.handleUserStatusMessage(messageStr)
                        break

                    case MqttMessageType.User_Device:
                        userHandlers.handleUserDeviceConnectedMessage(messageStr)
                        break

                    case MqttMessageType.Task_Comment_reaction:
                        taskHandler.handleTaskCommentReactionMessage(messageStr)
                        break

                    case MqttMessageType.Task_Comment:
                        taskHandler.handleTaskCommentMessage(messageStr)
                        break

                    case MqttMessageType.Doc_Comment:
                        docHandler.handleDocCommentMessage(messageStr)
                        break

                    case MqttMessageType.Doc_Comment_reaction:
                        docHandler.handleDocCommentReactionMessage(messageStr)
                        break

                    case MqttMessageType.Activity:
                        activityHandler.handleActivityMessage(messageStr)
                        break


                    default:
                        console.warn("[MQTT] Unknown message type:", parsedMessage.type)

                }
            } catch (error) {
                console.error("[MQTT] Message parsing error:", error, "Raw message:", message.toString())
            }
        },
        [postHandlers, chatHandlers, typingHandlers],
    )

    const cleanup = useCallback(() => {
        typingTimeouts.current.forEach(({ timer }) => {
            clearTimeout(timer)
        })
        typingTimeouts.current.clear()
    }, [])

    return {
        handleMessage,
        cleanup,
    }
}
