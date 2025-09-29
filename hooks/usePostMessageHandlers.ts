"use client"

import { useCallback } from "react"
import { useDispatch } from "react-redux"
import mqttService, { MqttActionType } from "@/services/mqttService"
import {
    createPost,
    updatePostByPostId,
    removePostByPostId,
    createPostReactionPostId,
    updatePostReactionPostId,
    removePostReactionByPostId,
     updateChannelMessageReplyIncrement, updateChannelMessageReplyDecrement,

} from "@/store/slice/channelSlice"
import {
    createChannelComment, createChannelCommentReactionByCommentId,
    removeChannelCommentByCommentUUID, removeChannelCommentReactionByReactionId,
    updateChannelCommentByCommentUUID, updateChannelCommentReactionByCommentId
} from "@/store/slice/channelCommentSlice";
import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserProfileInterface} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";

export const usePostMessageHandlers = () => {
    const dispatch = useDispatch()
    const selfProfile = useFetchOnlyOnce<UserProfileInterface>(GetEndpointUrl.SelfProfile)

    const handlePostMessage = useCallback(
        (messageStr: string) => {
            try {
                const mqttPostInfo = mqttService.parsePostMsg(messageStr)

                if(selfProfile.data?.data.user_uuid == mqttPostInfo.data.user_uuid && !mqttPostInfo.data.post_fwd_msg_chat && !mqttPostInfo.data.post_fwd_msg_post) return

                switch (mqttPostInfo.data.type) {
                    case MqttActionType.Create:
                        dispatch(
                            createPost({
                                postId: mqttPostInfo.data.post_uuid,
                                postCreatedAt: mqttPostInfo.data.post_created_at,
                                postText: mqttPostInfo.data.post_html_text,
                                channelId: mqttPostInfo.data.post_channel_id,
                                postBy: {
                                    user_uuid: mqttPostInfo.data.user_uuid,
                                    user_name: mqttPostInfo.data.user_full_name,
                                    user_profile_object_key: mqttPostInfo.data.user_profile_object_key,
                                },
                                fwdChat: mqttPostInfo.data.post_fwd_msg_chat,
                                fwdPost: mqttPostInfo.data.post_fwd_msg_post,
                                attachments: mqttPostInfo.data.post_attachments,
                            }),
                        )
                        break

                    case MqttActionType.Update:
                        dispatch(
                            updatePostByPostId({
                                postId: mqttPostInfo.data.post_uuid,
                                channelId: mqttPostInfo.data.post_channel_id,
                                htmlText: mqttPostInfo.data.post_html_text,
                            }),
                        )
                        break

                    case MqttActionType.Delete:
                        dispatch(
                            removePostByPostId({
                                postId: mqttPostInfo.data.post_uuid,
                                channelId: mqttPostInfo.data.post_channel_id,
                            }),
                        )
                        break

                    default:
                        console.warn("[MQTT] Unknown post action type:", mqttPostInfo.data.type)
                }
            } catch (error) {
                console.error("[MQTT] Post message handling error:", error)
            }
        },
        [dispatch],
    )

    const handlePostReactionMessage = useCallback(
        (messageStr: string) => {
            try {
                const mqttPostReaction = mqttService.parsePostReactionMsg(messageStr)

                if(selfProfile.data?.data.user_uuid == mqttPostReaction.data.user_uuid) return


                switch (mqttPostReaction.data.type) {
                    case MqttActionType.Create:
                        dispatch(
                            createPostReactionPostId({
                                postId: mqttPostReaction.data.post_uuid,
                                channelId: mqttPostReaction.data.channel_id,
                                emojiId: mqttPostReaction.data.reaction_emoji_id,
                                reactionId: mqttPostReaction.data.reaction_id,
                                addedBy: {
                                    user_uuid: mqttPostReaction.data.user_uuid,
                                    user_name: mqttPostReaction.data.user_name,
                                    user_profile_object_key: mqttPostReaction.data.user_profile_object_key
                                },
                            }),
                        )
                        break

                    case MqttActionType.Update:
                        dispatch(
                            updatePostReactionPostId({
                                postId: mqttPostReaction.data.post_uuid,
                                channelId: mqttPostReaction.data.channel_id,
                                reactionId: mqttPostReaction.data.reaction_id,
                                emojiId: mqttPostReaction.data.reaction_emoji_id,
                            }),
                        )
                        break

                    case MqttActionType.Delete:
                        dispatch(
                            removePostReactionByPostId({
                                postId: mqttPostReaction.data.post_uuid,
                                channelId: mqttPostReaction.data.channel_id,
                                reactionId: mqttPostReaction.data.reaction_id,
                            }),
                        )
                        break

                    default:
                        console.warn("[MQTT] Unknown post reaction action type:", mqttPostReaction.data.type)
                }
            } catch (error) {
                console.error("[MQTT] Post reaction message handling error:", error)
            }
        },
        [dispatch],
    )

    const handlePostCommentReactionMessage = useCallback(
        (messageStr: string) => {
            try {
                const mqttPostCommentReaction = mqttService.parsePostCommentReactionMsg(messageStr)

                if(selfProfile.data?.data.user_uuid == mqttPostCommentReaction.data.user_uuid) return


                switch (mqttPostCommentReaction.data.type) {
                    case MqttActionType.Create:

                        dispatch(
                            createChannelCommentReactionByCommentId({
                                postId: mqttPostCommentReaction.data.post_uuid,
                                commentId: mqttPostCommentReaction.data.comment_uuid,
                                reactionId: mqttPostCommentReaction.data.reaction_id,
                                emojiId:mqttPostCommentReaction.data.reaction_emoji_id,
                                addedBy: {
                                    user_uuid: mqttPostCommentReaction.data.user_uuid,
                                    user_name: mqttPostCommentReaction.data.user_name,
                                    user_profile_object_key: ''
                                },
                            }),
                        )
                        break

                    case MqttActionType.Update:
                        dispatch(
                            updateChannelCommentReactionByCommentId({
                                postId: mqttPostCommentReaction.data.post_uuid,
                                commentId: mqttPostCommentReaction.data.comment_uuid,
                                reactionId: mqttPostCommentReaction.data.reaction_id,
                                emojiId: mqttPostCommentReaction.data.reaction_emoji_id,
                            }),
                        )
                        break

                    case MqttActionType.Delete:
                        dispatch(
                            removeChannelCommentReactionByReactionId({
                                postId: mqttPostCommentReaction.data.post_uuid,
                                commentId: mqttPostCommentReaction.data.comment_uuid,
                                reactionId: mqttPostCommentReaction.data.reaction_id,
                            }),
                        )
                        break

                    default:
                        console.warn("[MQTT] Unknown post comment reaction action type:", mqttPostCommentReaction.data.type)
                }
            } catch (error) {
                console.error("[MQTT] Post comment reaction message handling error:", error)
            }
        },
        [dispatch],
    )

    const handlePostCommentMessage = useCallback(
        (messageStr: string) => {
            try {
                const mqttPostCommentCount = mqttService.parsePostCommentMsg(messageStr)

                if(selfProfile.data?.data.user_uuid == mqttPostCommentCount.data.user_uuid) return

                switch (mqttPostCommentCount.data.type) {
                    case MqttActionType.Create:
                        dispatch(
                            updateChannelMessageReplyIncrement({
                                comment: {
                                    comment_text:  '',
                                    comment_uuid: mqttPostCommentCount.data.comment_uuid,
                                    comment_created_at: mqttPostCommentCount.data.created_at,
                                },
                                messageId: mqttPostCommentCount.data.post_id,
                                channelId: mqttPostCommentCount.data.channel_id
                            })
                        )

                        dispatch(
                            createChannelComment({
                                commentId: mqttPostCommentCount.data.comment_uuid,
                                commentText: mqttPostCommentCount.data.body_text,
                                commentCreatedAt: mqttPostCommentCount.data.created_at,
                                commentBy: {
                                    user_uuid: mqttPostCommentCount.data.user_uuid,
                                    user_name: mqttPostCommentCount.data.user_name,
                                    user_profile_object_key: mqttPostCommentCount.data.user_profile_object_key,
                                },
                                postId: mqttPostCommentCount.data.post_id,
                                attachments: mqttPostCommentCount.data.comment_attachments

                            })
                        )

                        break

                    case MqttActionType.Delete:
                        dispatch(
                            updateChannelMessageReplyDecrement({
                                comment: {
                                    comment_text:  '',
                                    comment_uuid: mqttPostCommentCount.data.comment_uuid,
                                },
                                messageId: mqttPostCommentCount.data.post_id,
                                channelId: mqttPostCommentCount.data.channel_id
                            })
                        )

                        dispatch(
                            removeChannelCommentByCommentUUID({
                               commentUUID:mqttPostCommentCount.data.comment_uuid,
                                postId: mqttPostCommentCount.data.post_id,

                            })
                        )
                        break

                    case MqttActionType.Update:
                        dispatch(
                            updateChannelCommentByCommentUUID({
                                commentUUID: mqttPostCommentCount.data.comment_uuid,
                                htmlText: mqttPostCommentCount.data.body_text,
                                postId: mqttPostCommentCount.data.post_id,
                            })
                        )

                        break

                    default:
                        console.warn("[MQTT] Unknown post comment action type:", mqttPostCommentCount.data.type)
                }
            } catch (error) {
                console.error("[MQTT] Post comment count message handling error:", error)
            }
        },
        [dispatch],
    )

    return {
        handlePostMessage,
        handlePostReactionMessage,
        handlePostCommentMessage,
        handlePostCommentReactionMessage
    }
}
