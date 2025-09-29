"use client"

import { useCallback } from "react"
import { useDispatch } from "react-redux"
import mqttService, { MqttActionType } from "@/services/mqttService"
import {
    createChat,
    updateChatByChatId,
    removeChatByChatId,
    createChatReactionChatId,
    updateChatReactionByChatId,
    removeChatReactionByChatId,
    updateChatMessageReplyIncrement,
    updateChatMessageReplyDecrement,
} from "@/store/slice/chatSlice"
import {getOtherUserId} from "@/lib/utils/getOtherUserId";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserProfileDataInterface, UserProfileInterface} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";

import {
    createChatComment,
    createChatCommentReactionByCommentId,
    removeChatCommentByCommentId, removeChatCommentReactionByCommentId,
    updateChatCommentByCommentId, updateChatCommentReactionByCommentId
} from "@/store/slice/chatCommentSlice";

interface UseChatMessageHandlersProps {
    userUuid?: string
}

export const useChatMessageHandlers = ({ userUuid }: UseChatMessageHandlersProps) => {
    const dispatch = useDispatch()

    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const handleChatMessage = useCallback(
        (messageStr: string) => {
            try {
                const mqttChatInfo = mqttService.parseChatMsg(messageStr)

                if(selfProfile.data?.data.user_uuid == mqttChatInfo.data.user_uuid) return

                const dmId = getOtherUserId(mqttChatInfo.data.chat_grp_id, userUuid || "")

                switch (mqttChatInfo.data.type) {
                    case MqttActionType.Create:
                        dispatch(
                            createChat({
                                chatId: mqttChatInfo.data.chat_uuid,
                                chatCreatedAt: mqttChatInfo.data.chat_created_at,
                                chatText: mqttChatInfo.data.chat_html_text,
                                dmId: dmId,
                                chatBy: {
                                    user_uuid: mqttChatInfo.data.user_uuid,
                                    user_name: mqttChatInfo.data.user_full_name,
                                    user_profile_object_key: mqttChatInfo.data.user_profile_object_key,
                                },
                                attachments: mqttChatInfo.data.chat_attachments,
                                chatTo: selfProfile.data?.data || {} as UserProfileDataInterface,
                                fwdChat: mqttChatInfo.data.chat_fwd_msg_chat,
                                fwdPost:  mqttChatInfo.data.chat_fwd_msg_post
                            }),
                        )
                        break

                    case MqttActionType.Update:
                        dispatch(
                            updateChatByChatId({
                                chatId: mqttChatInfo.data.chat_uuid,
                                messageId: dmId,
                                htmlText: mqttChatInfo.data.chat_html_text,
                            }),
                        )
                        break

                    case MqttActionType.Delete:
                        dispatch(
                            removeChatByChatId({
                                chatId: mqttChatInfo.data.chat_uuid,
                                messageId: dmId,
                            }),
                        )
                        break

                    default:
                        console.warn("[MQTT] Unknown chat action type:", mqttChatInfo.data.type)
                }
            } catch (error) {
                console.error("[MQTT] Chat message handling error:", error)
            }
        },
        [dispatch, userUuid],
    )

    const handleChatReactionMessage = useCallback(
        (messageStr: string) => {
            try {
                const mqttChatReaction = mqttService.parseChatReactionMsg(messageStr)

                if(selfProfile.data?.data.user_uuid == mqttChatReaction.data.user_uuid) return

                const dmId = getOtherUserId(mqttChatReaction.data.chat_grp_id, userUuid || "")

                switch (mqttChatReaction.data.type) {
                    case MqttActionType.Create:
                        dispatch(
                            createChatReactionChatId({
                                chatId: mqttChatReaction.data.chat_uuid,
                                messageId: dmId,
                                emojiId: mqttChatReaction.data.reaction_emoji_id,
                                reactionId: mqttChatReaction.data.reaction_id,
                                addedBy: {
                                    user_uuid: mqttChatReaction.data.user_uuid,
                                    user_name: mqttChatReaction.data.user_name,
                                    user_email_id: "",
                                    user_profile_object_key: "",
                                },
                            }),
                        )
                        break

                    case MqttActionType.Update:
                        dispatch(
                            updateChatReactionByChatId({
                                chatId: mqttChatReaction.data.chat_uuid,
                                messageId: dmId,
                                reactionId: mqttChatReaction.data.reaction_id,
                                emojiId: mqttChatReaction.data.reaction_emoji_id,
                            }),
                        )
                        break

                    case MqttActionType.Delete:
                        dispatch(
                            removeChatReactionByChatId({
                                chatId: mqttChatReaction.data.chat_uuid,
                                messageId: dmId,
                                reactionId: mqttChatReaction.data.reaction_id,
                            }),
                        )
                        break

                    default:
                        console.warn("[MQTT] Unknown chat reaction action type:", mqttChatReaction.data.type)
                }
            } catch (error) {
                console.error("[MQTT] Chat reaction message handling error:", error)
            }
        },
        [dispatch, userUuid],
    )

    const handleChatCommentReactionMessage = useCallback(
        (messageStr: string) => {
            try {
                const mqttChatCommentReaction = mqttService.parseChatCommentReactionMsg(messageStr)

                if(selfProfile.data?.data.user_uuid == mqttChatCommentReaction.data.user_uuid) return


                switch (mqttChatCommentReaction.data.type) {
                    case MqttActionType.Create:
                        dispatch(
                            createChatCommentReactionByCommentId({
                                commentId: mqttChatCommentReaction.data.comment_uuid,
                                chatId: mqttChatCommentReaction.data.message_uuid,
                                emojiId: mqttChatCommentReaction.data.reaction_emoji_id,
                                reactionId: mqttChatCommentReaction.data.reaction_id,
                                addedBy: {
                                    user_uuid: mqttChatCommentReaction.data.user_uuid,
                                    user_name: mqttChatCommentReaction.data.user_name,
                                    user_email_id: "",
                                    user_profile_object_key: "",
                                }
                            }),
                        )
                        break

                    case MqttActionType.Update:
                        dispatch(
                            updateChatCommentReactionByCommentId({
                                chatId: mqttChatCommentReaction.data.message_uuid,
                                commentId: mqttChatCommentReaction.data.comment_uuid,
                                reactionId: mqttChatCommentReaction.data.reaction_id,
                                emojiId: mqttChatCommentReaction.data.reaction_emoji_id,
                            }),
                        )
                        break

                    case MqttActionType.Delete:
                        dispatch(
                            removeChatCommentReactionByCommentId({
                                chatId: mqttChatCommentReaction.data.message_uuid,
                                commentId: mqttChatCommentReaction.data.comment_uuid,
                                reactionId: mqttChatCommentReaction.data.reaction_id,
                            }),
                        )
                        break

                    default:
                        console.warn("[MQTT] Unknown chat comment reaction action type:", mqttChatCommentReaction.data.type)
                }
            } catch (error) {
                console.error("[MQTT] Chat comment reaction message handling error:", error)
            }
        },
        [dispatch, userUuid],
    )




    const handleChatCommentMessage = useCallback(
        (messageStr: string) => {
            try {
                const mqttChatComment = mqttService.parseChatCommentMsg(messageStr)

                if(selfProfile.data?.data.user_uuid == mqttChatComment.data.user_uuid) return

                const dmId = getOtherUserId(mqttChatComment.data.chat_grp_id, userUuid || "")

                switch (mqttChatComment.data.type) {
                    case MqttActionType.Create:
                        dispatch(
                            updateChatMessageReplyIncrement({
                                comment: {
                                    comment_text:  '',
                                    comment_uuid: mqttChatComment.data.comment_uuid,
                                    comment_created_at: mqttChatComment.data.created_at,
                                },
                                messageId: mqttChatComment.data.message_id,
                                chatId: dmId
                            }),
                        )

                        dispatch(
                            createChatComment({
                                commentId: mqttChatComment.data.comment_uuid,
                                commentText: mqttChatComment.data.body_text,
                                commentCreatedAt: mqttChatComment.data.created_at,
                                commentBy: {
                                    user_uuid: mqttChatComment.data.user_uuid,
                                    user_name: mqttChatComment.data.user_name,
                                    user_profile_object_key: mqttChatComment.data.user_profile_object_key,
                                },
                                chatId: mqttChatComment.data.message_id,
                                attachments: mqttChatComment.data.comment_attachments

                            }),
                        )
                        break

                    case MqttActionType.Delete:
                        dispatch(
                            updateChatMessageReplyDecrement({
                                comment: {
                                    comment_text:  '',
                                    comment_uuid: mqttChatComment.data.comment_uuid,
                                },
                                messageId: mqttChatComment.data.message_id,
                                chatId: dmId
                            }),
                        )

                        dispatch(
                            removeChatCommentByCommentId({
                                commentId:mqttChatComment.data.comment_uuid,
                                chatId: mqttChatComment.data.message_id,

                            }),
                        )
                        break


                    case MqttActionType.Update:
                        dispatch(
                            updateChatCommentByCommentId({
                                commentId: mqttChatComment.data.comment_uuid,
                                htmlText: mqttChatComment.data.body_text,
                                chatId: mqttChatComment.data.message_id,
                            }),
                        )

                        break

                    default:
                        console.warn("[MQTT] Unknown chat comment count action type:", mqttChatComment.data.type)
                }
            } catch (error) {
                console.error("[MQTT] Chat comment count message handling error:", error)
            }
        },
        [dispatch, userUuid],
    )

    return {
        handleChatMessage,
        handleChatReactionMessage,
        handleChatCommentMessage,
        handleChatCommentReactionMessage
    }
}
