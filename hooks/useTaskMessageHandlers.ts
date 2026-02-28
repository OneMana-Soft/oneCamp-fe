import {useFetchOnlyOnce} from "@/hooks/useFetch";
import {UserProfileInterface} from "@/types/user";
import {GetEndpointUrl} from "@/services/endPoints";
import {useDispatch} from "react-redux";
import {useCallback} from "react";
import mqttService, {MqttActionType} from "@/services/mqttService";
import {
    createNewTaskComment, createTaskCommentReactionByCommentId, removeTaskCommentByCommentUUID,
    removeTaskCommentReactionByReactionId,
    updateTaskCommentByCommentUUID, updateTaskCommentReactionByCommentId
} from "@/store/slice/createTaskCommentSlice";

interface UseTaskMessageHandlersProps {
    userUuid?: string
}

export const useTaskMessageHandlers = ({ userUuid }: UseTaskMessageHandlersProps) => {
    const dispatch = useDispatch()

    const handleTaskCommentMessage = useCallback(
        (messageStr: string) => {

            try {

                const mqttTaskComment = mqttService.parseTaskCommentMsg(messageStr)

                if(userUuid == mqttTaskComment.data.user_uuid) return

                switch (mqttTaskComment.data.type) {
                    case MqttActionType.Create:
                        dispatch(createNewTaskComment({
                            commentBy: {
                                user_uuid: mqttTaskComment.data.user_uuid,
                                user_name: mqttTaskComment.data.user_name,
                                user_profile_object_key: mqttTaskComment.data.user_profile_object_key,
                            },
                            taskId: mqttTaskComment.data.task_id,
                            commentText: mqttTaskComment.data.body_text,
                            attachments: mqttTaskComment.data.comment_attachments || [],
                            commentId: mqttTaskComment.data.comment_uuid,
                            commentCreatedAt: mqttTaskComment.data.created_at
                        }))

                        break;

                    case MqttActionType.Update:
                        dispatch(updateTaskCommentByCommentUUID({
                            taskId: mqttTaskComment.data.task_id,
                            commentUUID: mqttTaskComment.data.comment_uuid,
                            htmlText: mqttTaskComment.data.body_text,
                            updated_at: mqttTaskComment.data.updated_at,
                        }))

                        break;

                    case MqttActionType.Delete:
                        dispatch(removeTaskCommentByCommentUUID({
                            taskId: mqttTaskComment.data.task_id,
                            commentUUID: mqttTaskComment.data.comment_uuid,
                        }))

                        break

                    default:
                        console.warn("[MQTT] Unknown task comment action type:", mqttTaskComment.data.type)

                }


                } catch (error) {
                console.error("[MQTT] Task comment message handling error:", error)
            }
        },
        [dispatch, userUuid]
    )

    const handleTaskCommentReactionMessage = useCallback(
        (messageStr: string) => {

            try {

                const mqttTaskCommentReaction = mqttService.parseTaskCommentReactionMsg(messageStr)
                if(userUuid == mqttTaskCommentReaction.data.user_uuid) return

                switch (mqttTaskCommentReaction.data.type) {
                    case MqttActionType.Create:
                        dispatch(createTaskCommentReactionByCommentId({
                            taskId: mqttTaskCommentReaction.data.task_uuid,
                            commentId: mqttTaskCommentReaction.data.comment_uuid,
                            reactionId: mqttTaskCommentReaction.data.reaction_id,
                            emojiId:mqttTaskCommentReaction.data.reaction_emoji_id,
                            addedBy: {
                                user_uuid: mqttTaskCommentReaction.data.user_uuid,
                                user_name: mqttTaskCommentReaction.data.user_name,
                                user_profile_object_key: ''
                            },

                        }))
                        break

                    case MqttActionType.Update:
                        dispatch(updateTaskCommentReactionByCommentId({
                            taskId: mqttTaskCommentReaction.data.task_uuid,
                            commentId: mqttTaskCommentReaction.data.comment_uuid,
                            reactionId: mqttTaskCommentReaction.data.reaction_id,
                            emojiId: mqttTaskCommentReaction.data.reaction_emoji_id,
                        }))

                        break

                    case MqttActionType.Delete:
                        dispatch(removeTaskCommentReactionByReactionId({
                            taskId: mqttTaskCommentReaction.data.task_uuid,
                            commentId: mqttTaskCommentReaction.data.comment_uuid,
                            reactionId: mqttTaskCommentReaction.data.reaction_id,
                        }))


                    default:
                        console.warn("[MQTT] Unknown task comment reaction action type:", mqttTaskCommentReaction.data.type)

                }



            } catch (error) {
                console.error("[MQTT] Task comment reaction message handling error:", error)
            }

        },
        [dispatch, userUuid]
    )

    return {
        handleTaskCommentMessage,
        handleTaskCommentReactionMessage
    }
}