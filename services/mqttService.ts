// Mock MqttService for demonstration purposes
import {AttachmentMediaReq} from "@/types/attachment";
import {PostsRes} from "@/types/post";
import {ChatInfo} from "@/types/chat";
import {UserEmojiStatus} from "@/types/user";

export enum MqttMessageType {
    Post = 0,
    Post_Reaction,
    Post_Comment_Reaction,
    Channel_Typing,
    Chat,
    Chat_Reaction,
    Chat_Comment_Reaction,
    Chat_Typing,
    Post_Comment,
    Chat_Comment,
    User_Emoji_Status,
    User_Status,
    User_Device
}

export enum MqttActionType {
    Create = 0,
    Update,
    Delete
}

export interface msgType{
    type: MqttMessageType
}

export interface msgUserEmojiStatusInterface {
    type: MqttActionType
    user_emoji_status: UserEmojiStatus
    user_uuid: string
}

export interface msgUserStatusInterface {
    type: MqttActionType
    user_status: string
    user_uuid: string
}

export interface msgUserDeviceInterface {
    type: MqttActionType
    user_device_connected: number
    user_uuid: string
}

export interface msgChatInterface {
    type: MqttActionType
    chat_uuid: string
    chat_html_text: string
    user_uuid: string
    chat_grp_id: string
    chat_created_at: string
    chat_updated_at: string
    user_profile_object_key: string
    user_full_name: string
    chat_fwd_msg_post?: PostsRes
    chat_fwd_msg_chat?: ChatInfo
    chat_attachments: AttachmentMediaReq[]
}
export interface msgPostInterface {
    type: MqttActionType
    post_uuid: string
    post_html_text: string
    user_uuid: string
    post_channel_id: string
    post_created_at: string
    post_updated_at: string
    user_profile_object_key: string
    user_full_name: string
    post_fwd_msg_post?: PostsRes
    post_fwd_msg_chat?: ChatInfo
    post_attachments: AttachmentMediaReq[]
}


export interface msgChatReactionInterface {
    type: MqttActionType
    reaction_emoji_id: string
    user_uuid: string
    user_name: string
    chat_uuid: string
    chat_grp_id: string
    reaction_id: string
}

export interface msgChatCommentReactionInterface {
    type: MqttActionType
    reaction_emoji_id: string
    user_uuid: string
    user_name: string
    message_uuid: string
    reaction_id: string
    comment_uuid: string

}

export interface msgPostReactionInterface {
    type: MqttActionType
    reaction_emoji_id: string
    user_uuid: string
    user_name: string
    user_profile_object_key: string
    post_uuid: string
    channel_id: string
    reaction_id: string
}

export interface msgPostCommentReactionInterface {
    type: MqttActionType
    reaction_emoji_id: string
    user_uuid: string
    user_name: string
    post_uuid: string
    comment_uuid: string
    reaction_id: string
}

export interface msgChannelTypingInterface {
    user_uuid: string
    user_profile: string
    user_name: string
    channel_id: string
}

export interface msgChatComment {
    type: number
    message_id: string
    chat_grp_id: string
    created_at: string
    body_text: string
    comment_uuid: string
    user_uuid: string
    user_name: string
    user_profile_object_key: string
    comment_attachments: AttachmentMediaReq[]
}

export interface msgPostCommentInterface {
    type: number
    post_id: string
    channel_id: string
    created_at: string
    body_text: string
    comment_uuid: string
    user_uuid: string
    user_name: string
    user_profile_object_key: string
    comment_attachments: AttachmentMediaReq[]

}
export interface msgDmTypingInterface {
    user_uuid: string
    user_profile: string
    user_name: string
    chat_grp_id: string
}
interface rawMsgPostReactionInterface {
    type: number
    data: msgPostReactionInterface
}

interface rawMsgPostCommentReactionInterface {
    type: number
    data: msgPostCommentReactionInterface
}

interface rawMsgChatReactionInterface {
    type: number
    data: msgChatReactionInterface
}

interface rawMsgChatCommentReactionInterface {
    type: number
    data: msgChatCommentReactionInterface
}

interface rawMsgPostInterface {
    type: number
    data: msgPostInterface
}

interface rawMsgChatInterface {
    type: number
    data: msgChatInterface
}

interface rawMsgUserEmojiStatusInterface {
    type: number
    data: msgUserEmojiStatusInterface
}

interface rawMsgUserStatusInterface {
    type: number
    data: msgUserStatusInterface
}

interface rawMsgUserDeviceConnectedInterface {
    type: number
    data: msgUserDeviceInterface
}

interface rawMsgChannelTypingInterface {
    type: number
    data: msgChannelTypingInterface
}

interface rawMsgChatTypingInterface {
    type: number
    data: msgDmTypingInterface
}


interface rawMsgPostCommentInterface {
    type: number
    data: msgPostCommentInterface
}

interface rawMsgChatComment {
    type: number
    data: msgChatComment
}


class MqttService {
    parsePostMsg(messageStr: string) {

            const rawPost: rawMsgPostInterface = JSON.parse(messageStr)
            return rawPost

    }

    parsePostReactionMsg(messageStr: string) {
            const rawPost: rawMsgPostReactionInterface = JSON.parse(messageStr)
            return rawPost

    }

    parsePostCommentReactionMsg(messageStr: string) {
        const rawPost: rawMsgPostCommentReactionInterface = JSON.parse(messageStr)
        return rawPost

    }

    parsePostCommentMsg(messageStr: string) {

        const rawTypingInfo: rawMsgPostCommentInterface = JSON.parse(messageStr)
        return rawTypingInfo

    }

    parseChatMsg(messageStr: string) {
            const rawChat: rawMsgChatInterface = JSON.parse(messageStr)
            return rawChat

    }

    parseChatReactionMsg(messageStr: string) {
            const rawPost: rawMsgChatReactionInterface = JSON.parse(messageStr)
            return rawPost

    }

    parseChatCommentReactionMsg(messageStr: string) {
        const rawPost: rawMsgChatCommentReactionInterface = JSON.parse(messageStr)
        return rawPost

    }

    parseChatCommentMsg(messageStr: string) {
            const rawTypingInfo: rawMsgChatComment = JSON.parse(messageStr)
            return rawTypingInfo

    }

    parseChannelTypingMsg(messageStr: string) {
            const rawTypingInfo:  rawMsgChannelTypingInterface = JSON.parse(messageStr)
            return rawTypingInfo

    }

    parseChatTypingMsg(messageStr: string) {
            const rawTypingInfo: rawMsgChatTypingInterface = JSON.parse(messageStr)
            return rawTypingInfo

    }

    parseUserEmojiStatusMsg(messageStr: string) {
        const rawTypingInfo: rawMsgUserEmojiStatusInterface = JSON.parse(messageStr)
        return rawTypingInfo
    }

    parseUserStatusMsg(messageStr: string) {
        const rawTypingInfo: rawMsgUserStatusInterface = JSON.parse(messageStr)
        return rawTypingInfo
    }

    parseUserDeviceMsg(messageStr: string) {
        const rawTypingInfo: rawMsgUserDeviceConnectedInterface = JSON.parse(messageStr)
        return rawTypingInfo
    }

}

const mqttService = new MqttService()
export default mqttService
